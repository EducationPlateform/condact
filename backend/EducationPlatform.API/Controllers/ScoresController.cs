using EducationPlatform.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ScoresController : BaseController
{
    private readonly ApplicationDbContext _context;

    public ScoresController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMyScores()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized("User not found");
        }

        var scores = await _context.Scores
            .Include(s => s.Lecture)
            .Where(s => s.StudentId == userId)
            .OrderByDescending(s => s.UpdatedAt)
            .Select(s => new ScoreDto
            {
                Id = s.Id.ToString(),
                StudentId = s.StudentId.ToString(),
                LectureId = s.LectureId.ToString(),
                LectureTitle = s.Lecture != null ? s.Lecture.Title : string.Empty,
                HomeworkScore = s.HomeworkScore,
                ExamScore = s.ExamScore,
                TotalScore = s.TotalScore,
                UpdatedAt = s.UpdatedAt.ToString("O")
            })
            .ToListAsync();

        return Success(scores);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetAllScores()
    {
        var scores = await _context.Scores
            .Include(s => s.Student)
            .Include(s => s.Lecture)
            .OrderByDescending(s => s.UpdatedAt)
            .Select(s => new AdminScoreDto
            {
                Id = s.Id.ToString(),
                StudentId = s.StudentId.ToString(),
                StudentName = s.Student != null ? s.Student.Name : string.Empty,
                LectureId = s.LectureId.ToString(),
                LectureTitle = s.Lecture != null ? s.Lecture.Title : string.Empty,
                HomeworkScore = s.HomeworkScore,
                ExamScore = s.ExamScore,
                TotalScore = s.TotalScore,
                UpdatedAt = s.UpdatedAt.ToString("O")
            })
            .ToListAsync();

        return Success(scores);
    }
}

public class ScoreDto
{
    public string Id { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string LectureId { get; set; } = string.Empty;
    public string LectureTitle { get; set; } = string.Empty;
    public decimal? HomeworkScore { get; set; }
    public decimal? ExamScore { get; set; }
    public decimal TotalScore { get; set; }
    public string UpdatedAt { get; set; } = string.Empty;
}

public class AdminScoreDto : ScoreDto
{
    public string StudentName { get; set; } = string.Empty;
}
