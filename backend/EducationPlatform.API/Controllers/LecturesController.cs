using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EducationPlatform.Infrastructure.Data;
using EducationPlatform.API.Services;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LecturesController : BaseController
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly ILogger<LecturesController> _logger;

    public LecturesController(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        IWebHostEnvironment environment,
        IConfiguration configuration,
        ILogger<LecturesController> logger)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _environment = environment;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> Create(
        [FromForm] string groupId,
        [FromForm] string title,
        [FromForm] string? description,
        [FromForm] string? scheduledDate,
        [FromForm] bool? isPublished,
        [FromForm] int? order,
        [FromForm] string? grade,
        IFormFile? video)
    {
        if (!Guid.TryParse(groupId, out var groupGuid))
        {
            return Error("Invalid group ID");
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var lecture = new Domain.Entities.Lecture
            {
                Id = Guid.NewGuid(),
                GroupId = groupGuid,
                Title = title,
                Description = description,
                ScheduledDate = !string.IsNullOrEmpty(scheduledDate)
                    ? DateTime.SpecifyKind(DateTime.Parse(scheduledDate), DateTimeKind.Utc)
                    : null,
                IsPublished = isPublished ?? false,
                Order = order ?? 0,
                CreatedAt = DateTime.UtcNow,
                Grade = grade ?? string.Empty
            };

            _context.Lectures.Add(lecture);

            string? fullVideoPath = null;

            if (video != null && video.Length > 0)
            {
                var fileUrl = await _fileStorageService.SaveVideoAsync(video, lecture.Id);
                fullVideoPath = Path.Combine(_environment.ContentRootPath, fileUrl);

                var videoEntity = new Domain.Entities.Video
                {
                    Id = Guid.NewGuid(),
                    LectureId = lecture.Id,
                    FileUrl = fileUrl,
                    FileName = video.FileName,
                    UploadDate = DateTime.UtcNow,
                    SecurityConfig = "{\"drmEnabled\":false,\"watermarkEnabled\":true}"
                };

                _context.Videos.Add(videoEntity);
                lecture.VideoId = videoEntity.Id;
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // Background processing if video exists
            if (fullVideoPath != null && lecture.VideoId.HasValue)
            {
                var videoId = lecture.VideoId.Value;
                var serviceProvider = HttpContext.RequestServices;
                _ = Task.Run(async () =>
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var scopedContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                        var scopedVideoProcessing = scope.ServiceProvider.GetRequiredService<IVideoProcessingService>();
                        var scopedLogger = scope.ServiceProvider.GetRequiredService<ILogger<LecturesController>>();

                        try
                        {
                            var ffmpegPath = _configuration["VideoProcessing:FfmpegPath"] ?? "ffmpeg";
                            var duration = await scopedVideoProcessing.GetVideoDurationAsync(fullVideoPath, ffmpegPath);
                            if (duration.HasValue)
                            {
                                var videoInScope = await scopedContext.Videos.FindAsync(videoId);
                                if (videoInScope != null)
                                {
                                    videoInScope.Duration = duration.Value;
                                    await scopedContext.SaveChangesAsync();
                                }
                            }

                            var enableHls = _configuration.GetValue("VideoProcessing:EnableHls", true);
                            if (enableHls)
                            {
                                try
                                {
                                    await scopedVideoProcessing.GenerateHlsManifestAsync(fullVideoPath, videoId,
                                        ffmpegPath);
                                }
                                catch (Exception ex)
                                {
                                    scopedLogger.LogError(ex, "Failed to generate HLS manifest for video {VideoId}",
                                        videoId);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            scopedLogger.LogError(ex, "Error processing video {VideoId}", videoId);
                        }
                    }
                });
            }

            var lectureDto = await MapToLectureDtoAsync(lecture);
            return Success(lectureDto);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Failed to create lecture with video");
            return Error("Failed to create lecture: " + ex.Message);
        }
    }

    [HttpGet("group/{groupId}")]
    public async Task<IActionResult> GetByGroup(string groupId)
    {
        if (!Guid.TryParse(groupId, out var id))
        {
            return Error("Invalid group ID");
        }

        var lectures = await _context.Lectures
            .Where(l => l.GroupId == id)
            .OrderBy(l => l.Order)
            .ToListAsync();

        var lectureDtos = new List<LectureDto>();
        foreach (var lecture in lectures)
        {
            lectureDtos.Add(await MapToLectureDtoAsync(lecture));
        }

        return Success(lectureDtos);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var lectures = await _context.Lectures
            .Include(l => l.PdfFiles)
            .ToListAsync();
        var lectureDtos = lectures.Select(MapToLectureDto).ToList();
        return Success(lectureDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!Guid.TryParse(id, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var lecture = await _context.Lectures.FindAsync(lectureId);
        if (lecture == null)
        {
            return NotFound("Lecture not found");
        }

        var lectureDto = await MapToLectureDtoAsync(lecture);
        return Success(lectureDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateLectureRequest request)
    {
        if (!Guid.TryParse(id, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var lecture = await _context.Lectures.FindAsync(lectureId);
        if (lecture == null)
        {
            return NotFound("Lecture not found");
        }

        if (!string.IsNullOrEmpty(request.Title))
        {
            lecture.Title = request.Title;
        }

        if (request.Description != null)
        {
            lecture.Description = request.Description;
        }

        if (request.ScheduledDate != null)
        {
            lecture.ScheduledDate = DateTime.SpecifyKind(DateTime.Parse(request.ScheduledDate), DateTimeKind.Utc);
        }

        if (request.IsPublished.HasValue)
        {
            lecture.IsPublished = request.IsPublished.Value;
        }

        if (request.Order.HasValue)
        {
            lecture.Order = request.Order.Value;
        }

        if (request.Grade != null)
        {
            lecture.Grade = request.Grade;
        }

        await _context.SaveChangesAsync();

        var lectureDto = await MapToLectureDtoAsync(lecture);
        return Success(lectureDto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!Guid.TryParse(id, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var lecture = await _context.Lectures.FindAsync(lectureId);
        if (lecture == null)
        {
            return NotFound("Lecture not found");
        }

        _context.Lectures.Remove(lecture);
        await _context.SaveChangesAsync();

        return Success<object>(new { }, "Lecture deleted successfully");
    }

    [HttpPost("{id}/pdfs")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> UploadPdFs(string id, [FromForm] IFormFileCollection pdfs)
    {
        if (!Guid.TryParse(id, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var lecture = await _context.Lectures.FindAsync(lectureId);
        if (lecture == null)
        {
            return NotFound("Lecture not found");
        }

        var pdfFiles = new List<string>();

        foreach (var pdf in pdfs)
        {
            var fileUrl = await _fileStorageService.SavePdfAsync(pdf, lectureId);
            var pdfFile = new Domain.Entities.PdfFile
            {
                Id = Guid.NewGuid(),
                LectureId = lectureId,
                FileName = pdf.FileName,
                FileUrl = fileUrl,
                UploadDate = DateTime.UtcNow
            };

            _context.PdfFiles.Add(pdfFile);
            pdfFiles.Add(fileUrl);
        }

        await _context.SaveChangesAsync();

        return Success(new { pdfFiles });
    }

    [HttpGet("{id}/pdfs/{filename}")]
    public async Task<IActionResult> DownloadPdf(string id, string filename)
    {
        if (!Guid.TryParse(id, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var pdfFile = await _context.PdfFiles
            .FirstOrDefaultAsync(pf => pf.LectureId == lectureId && pf.FileName == filename);

        if (pdfFile == null)
        {
            return NotFound("PDF file not found");
        }

        var fileStream = await _fileStorageService.GetFileStreamAsync(pdfFile.FileUrl);
        if (fileStream == null)
        {
            return NotFound("File not found on disk");
        }

        return File(fileStream, "application/pdf", pdfFile.FileName);
    }

    private LectureDto MapToLectureDto(Domain.Entities.Lecture lecture)
    {
        var pdfFiles = lecture.PdfFiles.Select(pf => pf.FileUrl).ToList();

        return new LectureDto
        {
            Id = lecture.Id.ToString(),
            GroupId = lecture.GroupId.ToString(),
            Title = lecture.Title,
            Description = lecture.Description,
            VideoId = lecture.VideoId?.ToString(),
            PdfFiles = pdfFiles,
            ScheduledDate = lecture.ScheduledDate?.ToString("O"),
            IsPublished = lecture.IsPublished,
            Order = lecture.Order,
            CreatedAt = lecture.CreatedAt.ToString("O"),
            Grade = lecture.Grade
        };
    }

    private async Task<LectureDto> MapToLectureDtoAsync(Domain.Entities.Lecture lecture)
    {
        await _context.Entry(lecture).Reference(l => l.Group).LoadAsync();
        await _context.Entry(lecture).Collection(l => l.PdfFiles).LoadAsync();

        var pdfFiles = lecture.PdfFiles.Select(pf => pf.FileUrl).ToList();

        return new LectureDto
        {
            Id = lecture.Id.ToString(),
            GroupId = lecture.GroupId.ToString(),
            Title = lecture.Title,
            Description = lecture.Description,
            VideoId = lecture.VideoId?.ToString(),
            PdfFiles = pdfFiles,
            ScheduledDate = lecture.ScheduledDate?.ToString("O"),
            IsPublished = lecture.IsPublished,
            Order = lecture.Order,
            CreatedAt = lecture.CreatedAt.ToString("O"),
            Grade = lecture.Grade
        };
    }
}

public class CreateLectureRequest
{
    public string GroupId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ScheduledDate { get; set; }
    public bool? IsPublished { get; set; }
    public int? Order { get; set; }
    public string? Grade { get; set; }
    public IFormFile? Video { get; set; }
}

public class UpdateLectureRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ScheduledDate { get; set; }
    public bool? IsPublished { get; set; }
    public int? Order { get; set; }
    public string? Grade { get; set; }
}

public class LectureDto
{
    public string Id { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? VideoId { get; set; }
    public List<string> PdfFiles { get; set; } = new();
    public string? ScheduledDate { get; set; }
    public bool IsPublished { get; set; }
    public int Order { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
}
