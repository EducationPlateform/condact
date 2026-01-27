using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using EducationPlatform.Domain.Enums;
using EducationPlatform.Infrastructure.Data;
using EducationPlatform.API.Models;
using EducationPlatform.API.Services;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubmissionsController : BaseController
{
    private readonly ApplicationDbContext _context;
    private readonly IScoringService _scoringService;

    public SubmissionsController(ApplicationDbContext context, IScoringService scoringService)
    {
        _context = context;
        _scoringService = scoringService;
    }

    [HttpPost("homework")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> SubmitHomework([FromBody] SubmitHomeworkRequest request)
    {
        if (!Guid.TryParse(request.HomeworkId, out var homeworkId))
        {
            return Error("Invalid homework ID");
        }

        var homework = await _context.Homeworks.FindAsync(homeworkId);
        if (homework == null)
        {
            return NotFound("Homework not found");
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Get previous attempts
        var previousAttempts = await _context.Submissions
            .Where(s => s.StudentId == userId && s.HomeworkId == homeworkId)
            .CountAsync();

        var answersDict = request.Answers.ToDictionary(kvp => kvp.Key, kvp => (object)kvp.Value);
        var score = _scoringService.CalculateScore(homework, answersDict);

        var submission = new Domain.Entities.Submission
        {
            Id = Guid.NewGuid(),
            StudentId = userId,
            HomeworkId = homeworkId,
            Type = SubmissionType.Homework,
            Answers = System.Text.Json.JsonSerializer.Serialize(request.Answers),
            Score = score,
            SubmittedAt = DateTime.UtcNow,
            Attempts = previousAttempts + 1
        };

        _context.Submissions.Add(submission);

        // Update score
        await UpdateScoreAsync(userId, homework.LectureId, homeworkScore: score);

        await _context.SaveChangesAsync();

        var submissionDto = MapToSubmissionDto(submission);
        return Success(submissionDto);
    }

    [HttpPost("exam")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> SubmitExam([FromBody] SubmitExamRequest request)
    {
        if (!Guid.TryParse(request.ExamId, out var examId))
        {
            return Error("Invalid exam ID");
        }

        var exam = await _context.Exams.FindAsync(examId);
        if (exam == null)
        {
            return NotFound("Exam not found");
        }

        if (!exam.IsActive)
        {
            return Error("Exam is not active");
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Check if already submitted (exams can only be taken once)
        var existingSubmission = await _context.Submissions
            .FirstOrDefaultAsync(s => s.StudentId == userId && s.ExamId == examId);

        if (existingSubmission != null)
        {
            return Error("Exam already submitted");
        }

        var answersDict = request.Answers.ToDictionary(kvp => kvp.Key, kvp => (object)kvp.Value);
        var score = _scoringService.CalculateScore(exam, answersDict);

        var submission = new Domain.Entities.Submission
        {
            Id = Guid.NewGuid(),
            StudentId = userId,
            ExamId = examId,
            Type = SubmissionType.Exam,
            Answers = System.Text.Json.JsonSerializer.Serialize(request.Answers),
            Score = score,
            SubmittedAt = DateTime.UtcNow,
            Attempts = 1
        };

        _context.Submissions.Add(submission);

        // Update score
        await UpdateScoreAsync(userId, exam.LectureId, examScore: score);

        await _context.SaveChangesAsync();

        var submissionDto = MapToSubmissionDto(submission);
        return Success(submissionDto);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!Guid.TryParse(id, out var submissionId))
        {
            return Error("Invalid submission ID");
        }

        var submission = await _context.Submissions.FindAsync(submissionId);
        if (submission == null)
        {
            return NotFound("Submission not found");
        }

        var submissionDto = MapToSubmissionDto(submission);
        return Success(submissionDto);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? studentId, [FromQuery] string? lectureId)
    {
        var query = _context.Submissions
            .Include(s => s.Homework)
            .Include(s => s.Exam)
            .AsQueryable();

        if (!string.IsNullOrEmpty(studentId) && Guid.TryParse(studentId, out var sid))
        {
            query = query.Where(s => s.StudentId == sid);
        }

        if (!string.IsNullOrEmpty(lectureId) && Guid.TryParse(lectureId, out var lid))
        {
            query = query.Where(s => 
                (s.Homework != null && s.Homework.LectureId == lid) ||
                (s.Exam != null && s.Exam.LectureId == lid));
        }

        var submissions = await query.ToListAsync();
        var submissionDtos = submissions.Select(MapToSubmissionDto).ToList();

        return Success(submissionDtos);
    }

    [HttpPut("{id}/score")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> UpdateScore(string id, [FromBody] UpdateScoreRequest request)
    {
        if (!Guid.TryParse(id, out var submissionId))
        {
            return Error("Invalid submission ID");
        }

        var submission = await _context.Submissions
            .Include(s => s.Homework)
            .Include(s => s.Exam)
            .FirstOrDefaultAsync(s => s.Id == submissionId);

        if (submission == null)
        {
            return NotFound("Submission not found");
        }

        submission.Score = request.Score;
        await _context.SaveChangesAsync();

        // Update score
        var lectureId = submission.HomeworkId.HasValue 
            ? submission.Homework!.LectureId 
            : submission.Exam!.LectureId;

        await UpdateScoreAsync(submission.StudentId, lectureId,
            submission.Type == SubmissionType.Homework ? request.Score : null,
            submission.Type == SubmissionType.Exam ? request.Score : null);

        await _context.SaveChangesAsync();

        var submissionDto = MapToSubmissionDto(submission);
        return Success(submissionDto);
    }

    private async Task UpdateScoreAsync(Guid studentId, Guid lectureId, decimal? homeworkScore = null, decimal? examScore = null)
    {
        var score = await _context.Scores
            .FirstOrDefaultAsync(s => s.StudentId == studentId && s.LectureId == lectureId);

        if (score == null)
        {
            score = new Domain.Entities.Score
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                LectureId = lectureId,
                TotalScore = 0,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Scores.Add(score);
        }

        if (homeworkScore.HasValue)
        {
            score.HomeworkScore = homeworkScore.Value;
        }

        if (examScore.HasValue)
        {
            score.ExamScore = examScore.Value;
        }

        score.TotalScore = (score.HomeworkScore ?? 0) + (score.ExamScore ?? 0);
        score.UpdatedAt = DateTime.UtcNow;
    }

    private SubmissionDto MapToSubmissionDto(Domain.Entities.Submission submission)
    {
        return new SubmissionDto
        {
            Id = submission.Id.ToString(),
            StudentId = submission.StudentId.ToString(),
            HomeworkId = submission.HomeworkId?.ToString(),
            ExamId = submission.ExamId?.ToString(),
            Type = submission.Type.ToString().ToLower(),
            Answers = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(submission.Answers) ?? new Dictionary<string, object>(),
            Score = submission.Score,
            SubmittedAt = submission.SubmittedAt.ToString("O"),
            Attempts = submission.Attempts
        };
    }
}

public class SubmitHomeworkRequest
{
    public string HomeworkId { get; set; } = string.Empty;
    public Dictionary<string, object> Answers { get; set; } = new();
}

public class SubmitExamRequest
{
    public string ExamId { get; set; } = string.Empty;
    public Dictionary<string, object> Answers { get; set; } = new();
}

public class UpdateScoreRequest
{
    public decimal Score { get; set; }
}

public class SubmissionDto
{
    public string Id { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string? HomeworkId { get; set; }
    public string? ExamId { get; set; }
    public string Type { get; set; } = string.Empty;
    public Dictionary<string, object> Answers { get; set; } = new();
    public decimal? Score { get; set; }
    public string SubmittedAt { get; set; } = string.Empty;
    public int Attempts { get; set; }
}
