using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EducationPlatform.Infrastructure.Data;
using EducationPlatform.API.Models;
using EducationPlatform.API.Services;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccessController : BaseController
{
    private readonly ApplicationDbContext _context;
    private readonly IAccessControlService _accessControlService;

    public AccessController(ApplicationDbContext context, IAccessControlService accessControlService)
    {
        _context = context;
        _accessControlService = accessControlService;
    }

    [HttpPost("grant")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GrantAccess([FromBody] GrantAccessRequest request)
    {
        if (!Guid.TryParse(request.StudentId, out var studentId))
        {
            return Error("Invalid student ID");
        }

        if (!Guid.TryParse(request.LectureId, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var grantedBy = User.IsInRole("Admin") ? "admin" : "teacher";
        var access = await _accessControlService.GrantAccessAsync(studentId, lectureId, request.MaxViews, grantedBy);

        if (access == null)
        {
            return Error("Failed to grant access");
        }

        var accessDto = AccessControllerExtensions.MapToStudentAccessDto(access);
        return Success(accessDto);
    }

    [HttpPost("extend")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> ExtendAccess([FromBody] ExtendAccessRequest request)
    {
        if (!Guid.TryParse(request.StudentId, out var studentId))
        {
            return Error("Invalid student ID");
        }

        if (!Guid.TryParse(request.LectureId, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var access = await _accessControlService.ExtendAccessAsync(studentId, lectureId, request.AdditionalViews);

        if (access == null)
        {
            return NotFound("Access not found");
        }

        var accessDto = AccessControllerExtensions.MapToStudentAccessDto(access);
        return Success(accessDto);
    }

    [HttpGet("check/{lectureId}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> CheckAccess(string lectureId)
    {
        if (!Guid.TryParse(lectureId, out var id))
        {
            return Error("Invalid lecture ID");
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var access = await _accessControlService.CheckAccessAsync(userId, id);

        if (access == null)
        {
            return NotFound("No access found");
        }

        var accessDto = AccessControllerExtensions.MapToStudentAccessDto(access);
        return Success(accessDto);
    }

    [HttpPost("record-view")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> RecordView([FromBody] RecordViewRequest request)
    {
        if (!Guid.TryParse(request.LectureId, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var access = await _accessControlService.RecordViewAsync(userId, lectureId);

        if (access == null)
        {
            return Error("No access or views exhausted");
        }

        return Success(new
        {
            maxViews = access.MaxViews,
            currentViews = access.CurrentViews,
            remainingViews = access.MaxViews - access.CurrentViews
        });
    }

    [HttpPost("redeem")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> RedeemCode([FromBody] RedeemCodeRequest request)
    {
        if (!Guid.TryParse(request.LectureId, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var access = await _accessControlService.RedeemCodeAsync(userId, lectureId, request.Code);

        if (access == null)
        {
            return Error("Invalid or expired code");
        }

        return Success(new { studentAccess = AccessControllerExtensions.MapToStudentAccessDto(access) });
    }

    [HttpPost("generate")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GenerateCode([FromBody] GenerateCodeRequest request)
    {
        if (!Guid.TryParse(request.LectureId, out var lectureId))
        {
            return Error("Invalid lecture ID");
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var expiresAt = !string.IsNullOrEmpty(request.ExpiresAt)
            ? DateTime.SpecifyKind(DateTime.Parse(request.ExpiresAt), DateTimeKind.Utc)
            : (DateTime?)null;

        var accessCode = await _accessControlService.GenerateCodeAsync(
            lectureId, userId, request.MaxViews, expiresAt);

        return Success(new { code = accessCode.Code });
    }
}

public class GrantAccessRequest
{
    public string StudentId { get; set; } = string.Empty;
    public string LectureId { get; set; } = string.Empty;
    public int? MaxViews { get; set; }
}

public class ExtendAccessRequest
{
    public string StudentId { get; set; } = string.Empty;
    public string LectureId { get; set; } = string.Empty;
    public int AdditionalViews { get; set; }
}

public class RecordViewRequest
{
    public string LectureId { get; set; } = string.Empty;
}

public class RedeemCodeRequest
{
    public string LectureId { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class GenerateCodeRequest
{
    public string LectureId { get; set; } = string.Empty;
    public int? MaxViews { get; set; }
    public string? ExpiresAt { get; set; }
}

public class StudentAccessDto
{
    public string Id { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string LectureId { get; set; } = string.Empty;
    public int MaxViews { get; set; }
    public int CurrentViews { get; set; }
    public int RemainingViews => MaxViews - CurrentViews;
    public string? LastViewedAt { get; set; }
}

public static class AccessControllerExtensions
{
    public static StudentAccessDto MapToStudentAccessDto(Domain.Entities.StudentAccess access)
    {
        return new StudentAccessDto
        {
            Id = access.Id.ToString(),
            StudentId = access.StudentId.ToString(),
            LectureId = access.LectureId.ToString(),
            MaxViews = access.MaxViews,
            CurrentViews = access.CurrentViews,
            LastViewedAt = access.LastViewedAt?.ToString("O")
        };
    }
}
