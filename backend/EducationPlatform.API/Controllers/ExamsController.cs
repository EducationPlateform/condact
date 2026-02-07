using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EducationPlatform.Infrastructure.Data;
using EducationPlatform.API.Models;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExamsController : BaseController
{
    private readonly ApplicationDbContext _context;

    public ExamsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateExamRequest request)
    {
        if (!Guid.TryParse(request.LectureId, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var exam = new Domain.Entities.Exam
        {
            Id = Guid.NewGuid(),
            LectureId = lectureId,
            Title = request.Title,
            Description = request.Description,
            Questions = System.Text.Json.JsonSerializer.Serialize(request.Questions ?? new List<object>()),
            MaxScore = request.MaxScore,
            TimeLimit = request.TimeLimit,
            IsActive = request.IsActive ?? true,
            DueDate = !string.IsNullOrEmpty(request.DueDate) ? DateTime.Parse(request.DueDate) : null,
            CreatedAt = DateTime.UtcNow
        };

        _context.Exams.Add(exam);
        await _context.SaveChangesAsync();

        var examDto = MapToExamDto(exam);
        return Success(examDto);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var exams = await _context.Exams.ToListAsync();
        var examDtos = exams.Select(MapToExamDto).ToList();
        return Success(examDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!Guid.TryParse(id, out var examId))
        {
            return Error("Invalid exam ID");
        }

        var exam = await _context.Exams.FindAsync(examId);
        if (exam == null)
        {
            return NotFound("Exam not found");
        }

        var examDto = MapToExamDto(exam);
        return Success(examDto);
    }

    [HttpGet("lecture/{lectureId}")]
    public async Task<IActionResult> GetByLecture(string lectureId)
    {
        if (!Guid.TryParse(lectureId, out var id))
        {
            return Error("Invalid lecture ID");
        }

        var exam = await _context.Exams
            .FirstOrDefaultAsync(e => e.LectureId == id);

        if (exam == null)
        {
            return NotFound("Exam not found");
        }

        var examDto = MapToExamDto(exam);
        return Success(examDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateExamRequest request)
    {
        if (!Guid.TryParse(id, out var examId))
        {
            return Error("Invalid exam ID");
        }

        var exam = await _context.Exams.FindAsync(examId);
        if (exam == null)
        {
            return NotFound("Exam not found");
        }

        if (!string.IsNullOrEmpty(request.Title))
        {
            exam.Title = request.Title;
        }

        if (request.Description != null)
        {
            exam.Description = request.Description;
        }

        if (request.Questions != null)
        {
            exam.Questions = System.Text.Json.JsonSerializer.Serialize(request.Questions);
        }

        if (request.MaxScore.HasValue)
        {
            exam.MaxScore = request.MaxScore.Value;
        }

        if (request.TimeLimit.HasValue)
        {
            exam.TimeLimit = request.TimeLimit.Value;
        }

        if (request.IsActive.HasValue)
        {
            exam.IsActive = request.IsActive.Value;
        }

        if (request.DueDate != null)
        {
            exam.DueDate = DateTime.Parse(request.DueDate);
        }

        await _context.SaveChangesAsync();

        var examDto = MapToExamDto(exam);
        return Success(examDto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!Guid.TryParse(id, out var examId))
        {
            return Error("Invalid exam ID");
        }

        var exam = await _context.Exams.FindAsync(examId);
        if (exam == null)
        {
            return NotFound("Exam not found");
        }

        _context.Exams.Remove(exam);
        await _context.SaveChangesAsync();

        return Success<object>(null, "Exam deleted successfully");
    }

    private ExamDto MapToExamDto(Domain.Entities.Exam exam)
    {
        return new ExamDto
        {
            Id = exam.Id.ToString(),
            LectureId = exam.LectureId.ToString(),
            Title = exam.Title,
            Description = exam.Description,
            Questions = System.Text.Json.JsonSerializer.Deserialize<List<object>>(exam.Questions) ?? new List<object>(),
            MaxScore = exam.MaxScore,
            TimeLimit = exam.TimeLimit,
            IsActive = exam.IsActive,
            DueDate = exam.DueDate?.ToString("O"),
            CreatedAt = exam.CreatedAt.ToString("O")
        };
    }
}

public class CreateExamRequest
{
    public string LectureId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<object>? Questions { get; set; }
    public decimal MaxScore { get; set; }
    public int TimeLimit { get; set; }
    public bool? IsActive { get; set; }
    public string? DueDate { get; set; }
}

public class UpdateExamRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public List<object>? Questions { get; set; }
    public decimal? MaxScore { get; set; }
    public int? TimeLimit { get; set; }
    public bool? IsActive { get; set; }
    public string? DueDate { get; set; }
}

public class ExamDto
{
    public string Id { get; set; } = string.Empty;
    public string LectureId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<object> Questions { get; set; } = new();
    public decimal MaxScore { get; set; }
    public int TimeLimit { get; set; }
    public bool IsActive { get; set; }
    public string? DueDate { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}
