using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EducationPlatform.Infrastructure.Data;
using EducationPlatform.API.Models;
using EducationPlatform.API.Services;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VideosController : BaseController
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly IAccessControlService _accessControlService;
    private readonly IVideoProcessingService _videoProcessingService;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly ILogger<VideosController> _logger;

    public VideosController(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        _videoProcessingService = videoProcessingService;
    _environment = environment;
    _configuration = configuration;
    _logger = logger;
}

[HttpPost("upload")]
[Authorize(Roles = "Teacher,Admin")]
[Consumes("multipart/form-data")]
[DisableRequestSizeLimit]
[ProducesResponseType(typeof(ApiResponse<VideoDto>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
public async Task<IActionResult> Upload([FromForm] string lectureId)
{
    if (!Guid.TryParse(lectureId, out var id))
    {
        return Error("Invalid lecture ID");
    }

    var video = Request.Form.Files.GetFile("video");
    if (video == null || video.Length == 0)
    {
        return Error("No video file provided");
    }

    var lecture = await _context.Lectures
        .Include(l => l.Video)
        .FirstOrDefaultAsync(l => l.Id == id);

    if (lecture == null)
    {
        return NotFound("Lecture not found");
    }

    // Check if there's an existing video and remove it
    if (lecture.Video != null)
    {
        try
        {
            await _fileStorageService.DeleteFileAsync(lecture.Video.FileUrl);
            _context.Videos.Remove(lecture.Video);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete existing video file {FileUrl} during replacement",
                lecture.Video.FileUrl);
        }
    }

    var fileUrl = await _fileStorageService.SaveVideoAsync(video, id);
    var fullVideoPath = Path.Combine(_environment.ContentRootPath, fileUrl);

    var videoEntity = new Domain.Entities.Video
    {
        Id = Guid.NewGuid(),
        LectureId = id,
        FileUrl = fileUrl,
        FileName = video.FileName,
        UploadDate = DateTime.UtcNow,
        SecurityConfig = "{\"drmEnabled\":false,\"watermarkEnabled\":true}"
    };

    _context.Videos.Add(videoEntity);
    lecture.VideoId = videoEntity.Id;
    await _context.SaveChangesAsync();

    // Process video asynchronously (duration, HLS/DASH, etc.)
    var serviceProvider = HttpContext.RequestServices;
    _ = Task.Run(async () =>
    {
        using (var scope = serviceProvider.CreateScope())
        {
            var scopedContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var scopedVideoProcessing = scope.ServiceProvider.GetRequiredService<IVideoProcessingService>();
            var scopedLogger = scope.ServiceProvider.GetRequiredService<ILogger<VideosController>>();

            try
            {
                var ffmpegPath = _configuration["VideoProcessing:FfmpegPath"] ?? "ffmpeg";
                var duration = await scopedVideoProcessing.GetVideoDurationAsync(fullVideoPath, ffmpegPath);
                if (duration.HasValue)
                {
                    var videoInScope = await scopedContext.Videos.FindAsync(videoEntity.Id);
                    if (videoInScope != null)
                    {
                        videoInScope.Duration = duration.Value;
                        await scopedContext.SaveChangesAsync();
                    }
                }

                var enableHls = _configuration.GetValue<bool>("VideoProcessing:EnableHls", true);
                if (enableHls)
                {
                    try
                    {
                        await scopedVideoProcessing.GenerateHlsManifestAsync(fullVideoPath, videoEntity.Id,
                            ffmpegPath);
                    }
                    catch (Exception ex)
                    {
                        scopedLogger.LogError(ex, "Failed to generate HLS manifest for video {VideoId}",
                            videoEntity.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                scopedLogger.LogError(ex, "Error processing video {VideoId}", videoEntity.Id);
            }
        }
    });

    var videoDto = MapToVideoDto(videoEntity);
    return Success(videoDto);
}

[HttpGet("{id}")]
public async Task<IActionResult> GetById(string id)
{
    if (!Guid.TryParse(id, out var videoId))
    {
        return Error("Invalid video ID");
    }

    var video = await _context.Videos.FindAsync(videoId);
    if (video == null)
    {
        return NotFound("Video not found");
    }

    var videoDto = MapToVideoDto(video);
    return Success(videoDto);
}

[HttpGet("{id}/stream")]
[Authorize(Roles = "Student")]
[ProducesResponseType(StatusCodes.Status200OK)]
[Produces("video/mp4")]
public async Task<IActionResult> Stream(string id)
{
    if (!Guid.TryParse(id, out var videoId))
    {
        return Error("Invalid video ID");
    }

    var video = await _context.Videos
        .Include(v => v.Lecture)
        .FirstOrDefaultAsync(v => v.Id == videoId);

    if (video == null)
    {
        return NotFound("Video not found");
    }

    var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    // Check access
    var access = await _accessControlService.CheckAccessAsync(userId, video.LectureId);
    if (access == null || access.CurrentViews >= access.MaxViews)
    {
        return Unauthorized("No access or views exhausted");
    }

    // Record view
    await _accessControlService.RecordViewAsync(userId, video.LectureId);

    var fileStream = await _fileStorageService.GetFileStreamAsync(video.FileUrl);
    if (fileStream == null)
    {
        return NotFound("Video file not found");
    }

    return File(fileStream, "video/mp4");
}

[HttpDelete("{id}")]
[Authorize(Roles = "Teacher,Admin")]
public async Task<IActionResult> Delete(string id)
{
    if (!Guid.TryParse(id, out var videoId))
    {
        return Error("Invalid video ID");
    }

    var video = await _context.Videos.FindAsync(videoId);
    if (video == null)
    {
        return NotFound("Video not found");
    }

    await _fileStorageService.DeleteFileAsync(video.FileUrl);
    _context.Videos.Remove(video);
    await _context.SaveChangesAsync();

    return Success<object>(null, "Video deleted successfully");
}

[HttpGet("{id}/drm-config")]
[Authorize(Roles = "Student")]
public async Task<IActionResult> GetDrmConfig(string id)
{
    if (!Guid.TryParse(id, out var videoId))
    {
        return Error("Invalid video ID");
    }

    var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    var drmConfig = await _drmService.GetDrmConfigurationAsync(videoId);
    var licenseToken = await _drmService.GenerateLicenseTokenAsync(videoId, userId);

    return Success(new
    {
        drmConfig,
        licenseToken
    });
}

[HttpGet("{id}/violations")]
[Authorize(Roles = "Teacher,Admin")]
public async Task<IActionResult> GetViolations(string id)
{
    if (!Guid.TryParse(id, out var videoId))
    {
        return Error("Invalid video ID");
    }

    var violations = await _violationService.GetViolationsByVideoAsync(videoId);
    return Success(violations.Select(v => new
    {
        Id = v.Id.ToString(),
        StudentId = v.StudentId.ToString(),
        LectureId = v.LectureId.ToString(),
        VideoId = v.VideoId?.ToString(),
        ViolationType = v.ViolationType,
        Details = v.Details,
        DetectedAt = v.DetectedAt.ToString("O"),
        IpAddress = v.IpAddress,
        UserAgent = v.UserAgent
    }).ToList());
}

[HttpGet("{id}/manifest.m3u8")]
[Authorize(Roles = "Student")]
[ProducesResponseType(StatusCodes.Status200OK)]
[Produces("application/vnd.apple.mpegurl")]
public async Task<IActionResult> GetHlsManifest(string id)
{
    if (!Guid.TryParse(id, out var videoId))
    {
        return Error("Invalid video ID");
    }

    var video = await _context.Videos.FindAsync(videoId);
    if (video == null)
    {
        return NotFound("Video not found");
    }

    var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
    var access = await _accessControlService.CheckAccessAsync(userId, video.LectureId);
    if (access == null || access.CurrentViews >= access.MaxViews)
    {
        return Unauthorized("No access or views exhausted");
    }

    var manifestPath = Path.Combine(
        _environment.ContentRootPath,
        "wwwroot",
        "processed",
        videoId.ToString(),
        "hls",
        "manifest.m3u8"
    );

    if (!System.IO.File.Exists(manifestPath))
    {
        return NotFound("HLS manifest not found. Video may not be processed yet.");
    }

    var manifestContent = await System.IO.File.ReadAllTextAsync(manifestPath);
    return Content(manifestContent, "application/vnd.apple.mpegurl");
}

[HttpGet("{id}/manifest.mpd")]
[Authorize(Roles = "Student")]
[ProducesResponseType(StatusCodes.Status200OK)]
[Produces("application/dash+xml")]
public async Task<IActionResult> GetDashManifest(string id)
{
    if (!Guid.TryParse(id, out var videoId))
    {
        return Error("Invalid video ID");
    }

    var video = await _context.Videos.FindAsync(videoId);
    if (video == null)
    {
        return NotFound("Video not found");
    }

    var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
    var access = await _accessControlService.CheckAccessAsync(userId, video.LectureId);
    if (access == null || access.CurrentViews >= access.MaxViews)
    {
        return Unauthorized("No access or views exhausted");
    }

    var manifestPath = Path.Combine(
        _environment.ContentRootPath,
        "wwwroot",
        "processed",
        videoId.ToString(),
        "dash",
        "manifest.mpd"
    );

    if (!System.IO.File.Exists(manifestPath))
    {
        return NotFound("DASH manifest not found. Video may not be processed yet.");
    }

    var manifestContent = await System.IO.File.ReadAllTextAsync(manifestPath);
    return Content(manifestContent, "application/dash+xml");
}

private VideoDto MapToVideoDto(Domain.Entities.Video video)
{
    return new VideoDto
    {
        Id = video.Id.ToString(),
        LectureId = video.LectureId.ToString(),
        FileUrl = video.FileUrl,
        FileName = video.FileName,
        Duration = video.Duration,
        UploadDate = video.UploadDate.ToString("O"),
        StreamingUrl = video.StreamingUrl,
        SecurityConfig = System.Text.Json.JsonSerializer.Deserialize<SecurityConfigDto>(video.SecurityConfig) ??
                         new SecurityConfigDto()
    };
}

}

public class VideoDto
{
    public string Id { get; set; } = string.Empty;
    public string LectureId { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public int? Duration { get; set; }
    public string UploadDate { get; set; } = string.Empty;
    public string? StreamingUrl { get; set; }
    public SecurityConfigDto? SecurityConfig { get; set; }
}

public class SecurityConfigDto
{
    public bool DrmEnabled { get; set; }
    public bool WatermarkEnabled { get; set; }
}
