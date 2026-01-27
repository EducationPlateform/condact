using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EducationPlatform.API.Models;
using EducationPlatform.API.Services;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SecurityController : BaseController
{
    private readonly ISecurityViolationService _violationService;
    private readonly IWatermarkService _watermarkService;
    private readonly IDrmService _drmService;

    public SecurityController(
        ISecurityViolationService violationService,
        IWatermarkService watermarkService,
        IDrmService drmService)
    {
        _violationService = violationService;
        _watermarkService = watermarkService;
        _drmService = drmService;
    }

    [HttpPost("violation")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> ReportViolation([FromBody] ReportViolationRequest request)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

        await _violationService.LogViolationAsync(
            userId,
            Guid.Parse(request.LectureId),
            request.VideoId != null ? Guid.Parse(request.VideoId) : null,
            request.ViolationType,
            request.Details ?? "{}",
            ipAddress,
            userAgent
        );

        return Success<object>(null, "Violation reported");
    }

    [HttpGet("violations")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetViolations([FromQuery] string? studentId, [FromQuery] string? lectureId, [FromQuery] string? videoId)
    {
        if (!string.IsNullOrEmpty(videoId) && Guid.TryParse(videoId, out var vid))
        {
            var violations = await _violationService.GetViolationsByVideoAsync(vid);
            return Success(violations.Select(v => new SecurityViolationDto
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

        if (!string.IsNullOrEmpty(lectureId) && Guid.TryParse(lectureId, out var lid))
        {
            var violations = await _violationService.GetViolationsByLectureAsync(lid);
            return Success(violations.Select(v => new SecurityViolationDto
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

        if (!string.IsNullOrEmpty(studentId) && Guid.TryParse(studentId, out var sid))
        {
            var violations = await _violationService.GetViolationsByStudentAsync(sid);
            return Success(violations.Select(v => new SecurityViolationDto
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

        return Error("Please provide studentId, lectureId, or videoId");
    }

    [HttpGet("watermark/{lectureId}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetWatermarkData(string lectureId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var email = User.FindFirst(ClaimTypes.Email)?.Value ?? "";

        var watermarkData = _watermarkService.GetWatermarkOverlayData(userId, email);
        return Success(new { watermarkData });
    }
}

public class ReportViolationRequest
{
    public string LectureId { get; set; } = string.Empty;
    public string? VideoId { get; set; }
    public string ViolationType { get; set; } = string.Empty;
    public string? Details { get; set; }
}

public class SecurityViolationDto
{
    public string Id { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string LectureId { get; set; } = string.Empty;
    public string? VideoId { get; set; }
    public string ViolationType { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string DetectedAt { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}
