using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EducationPlatform.Infrastructure.Data;
using EducationPlatform.API.Models;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HomeworkController : BaseController
{
    private readonly ApplicationDbContext _context;

    public HomeworkController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateHomeworkRequest request)
    {
        if (!Guid.TryParse(request.LectureId, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var homework = new Domain.Entities.Homework
        {
            Id = Guid.NewGuid(),
            LectureId = lectureId,
            Title = request.Title,
            Description = request.Description,
            Questions = System.Text.Json.JsonSerializer.Serialize(request.Questions ?? new List<object>()),
            MaxScore = request.MaxScore,
            DueDate = !string.IsNullOrEmpty(request.DueDate) ? DateTime.Parse(request.DueDate) : null,
            CreatedAt = DateTime.UtcNow
        };

        _context.Homeworks.Add(homework);
        await _context.SaveChangesAsync();

        var homeworkDto = MapToHomeworkDto(homework);
        return Success(homeworkDto);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var homeworks = await _context.Homeworks.ToListAsync();
        var homeworkDtos = homeworks.Select(MapToHomeworkDto).ToList();
        return Success(homeworkDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!Guid.TryParse(id, out var homeworkId))
        {
            return Error("Invalid homework ID");
        }

        var homework = await _context.Homeworks.FindAsync(homeworkId);
        if (homework == null)
        {
            return NotFound("Homework not found");
        }

        var homeworkDto = MapToHomeworkDto(homework);
        return Success(homeworkDto);
    }

    [HttpGet("lecture/{lectureId}")]
    public async Task<IActionResult> GetByLecture(string lectureId)
    {
        if (!Guid.TryParse(lectureId, out var id))
        {
            return Error("Invalid lecture ID");
        }

        var homework = await _context.Homeworks
            .FirstOrDefaultAsync(h => h.LectureId == id);

        if (homework == null)
        {
            return NotFound("Homework not found");
        }

        var homeworkDto = MapToHomeworkDto(homework);
        return Success(homeworkDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateHomeworkRequest request)
    {
        if (!Guid.TryParse(id, out var homeworkId))
        {
            return Error("Invalid homework ID");
        }

        var homework = await _context.Homeworks.FindAsync(homeworkId);
        if (homework == null)
        {
            return NotFound("Homework not found");
        }

        if (!string.IsNullOrEmpty(request.Title))
        {
            homework.Title = request.Title;
        }

        if (request.Description != null)
        {
            homework.Description = request.Description;
        }

        if (request.Questions != null)
        {
            homework.Questions = System.Text.Json.JsonSerializer.Serialize(request.Questions);
        }

        if (request.MaxScore.HasValue)
        {
            homework.MaxScore = request.MaxScore.Value;
        }

        if (request.DueDate != null)
        {
            homework.DueDate = DateTime.Parse(request.DueDate);
        }

        await _context.SaveChangesAsync();

        var homeworkDto = MapToHomeworkDto(homework);
        return Success(homeworkDto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!Guid.TryParse(id, out var homeworkId))
        {
            return Error("Invalid homework ID");
        }

        var homework = await _context.Homeworks.FindAsync(homeworkId);
        if (homework == null)
        {
            return NotFound("Homework not found");
        }

        _context.Homeworks.Remove(homework);
        await _context.SaveChangesAsync();

        return Success<object>(null, "Homework deleted successfully");
    }

    private HomeworkDto MapToHomeworkDto(Domain.Entities.Homework homework)
    {
        return new HomeworkDto
        {
            Id = homework.Id.ToString(),
            LectureId = homework.LectureId.ToString(),
            Title = homework.Title,
            Description = homework.Description,
            Questions = System.Text.Json.JsonSerializer.Deserialize<List<object>>(homework.Questions) ?? new List<object>(),
            MaxScore = homework.MaxScore,
            DueDate = homework.DueDate?.ToString("O"),
            CreatedAt = homework.CreatedAt.ToString("O")
        };
    }
}

public class CreateHomeworkRequest
{
    public string LectureId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<object>? Questions { get; set; }
    public decimal MaxScore { get; set; }
    public string? DueDate { get; set; }
}

public class UpdateHomeworkRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public List<object>? Questions { get; set; }
    public decimal? MaxScore { get; set; }
    public string? DueDate { get; set; }
}

public class HomeworkDto
{
    public string Id { get; set; } = string.Empty;
    public string LectureId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<object> Questions { get; set; } = new();
    public decimal MaxScore { get; set; }
    public string? DueDate { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}
