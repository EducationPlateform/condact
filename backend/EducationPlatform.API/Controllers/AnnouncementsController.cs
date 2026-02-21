using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using EducationPlatform.Infrastructure.Data;
using EducationPlatform.API.Models;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnnouncementsController : BaseController
{
    private readonly ApplicationDbContext _context;

    public AnnouncementsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("active")]
    [Authorize(Roles = "Teacher,Student,Admin")]
    public async Task<IActionResult> GetActiveAnnouncements()
    {
        var now = DateTime.UtcNow;
        var announcements = await _context.Announcements
            .Where(a => a.IsActive && (a.ExpiresAt == null || a.ExpiresAt > now))
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        var announcementDtos = announcements.Select(a => new AnnouncementDto
        {
            Id = a.Id.ToString(),
            Title = a.Title,
            Message = a.Message,
            Type = a.Type,
            CreatedAt = a.CreatedAt.ToString("O"),
            ExpiresAt = a.ExpiresAt?.ToString("O")
        }).ToList();

        return Success(announcementDtos);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var announcements = await _context.Announcements
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        var announcementDtos = announcements.Select(a => new AnnouncementDto
        {
            Id = a.Id.ToString(),
            Title = a.Title,
            Message = a.Message,
            Type = a.Type,
            IsActive = a.IsActive,
            CreatedAt = a.CreatedAt.ToString("O"),
            ExpiresAt = a.ExpiresAt?.ToString("O"),
            CreatedBy = a.CreatedBy.ToString()
        }).ToList();

        return Success(announcementDtos);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateAnnouncementRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var announcement = new Announcement
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Message = request.Message,
            Type = request.Type ?? "info",
            IsActive = request.IsActive ?? true,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = !string.IsNullOrEmpty(request.ExpiresAt)
                ? DateTime.SpecifyKind(DateTime.Parse(request.ExpiresAt), DateTimeKind.Utc)
                : null,
            CreatedBy = userId
        };

        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync();

        var announcementDto = new AnnouncementDto
        {
            Id = announcement.Id.ToString(),
            Title = announcement.Title,
            Message = announcement.Message,
            Type = announcement.Type,
            IsActive = announcement.IsActive,
            CreatedAt = announcement.CreatedAt.ToString("O"),
            ExpiresAt = announcement.ExpiresAt?.ToString("O"),
            CreatedBy = announcement.CreatedBy.ToString()
        };

        return Success(announcementDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateAnnouncementRequest request)
    {
        if (!Guid.TryParse(id, out var announcementId))
        {
            return Error("Invalid announcement ID");
        }

        var announcement = await _context.Announcements.FindAsync(announcementId);
        if (announcement == null)
        {
            return NotFound("Announcement not found");
        }

        announcement.Title = request.Title ?? announcement.Title;
        announcement.Message = request.Message ?? announcement.Message;
        announcement.Type = request.Type ?? announcement.Type;
        announcement.IsActive = request.IsActive ?? announcement.IsActive;

        if (!string.IsNullOrEmpty(request.ExpiresAt))
        {
            announcement.ExpiresAt = DateTime.SpecifyKind(DateTime.Parse(request.ExpiresAt), DateTimeKind.Utc);
        }

        await _context.SaveChangesAsync();

        var announcementDto = new AnnouncementDto
        {
            Id = announcement.Id.ToString(),
            Title = announcement.Title,
            Message = announcement.Message,
            Type = announcement.Type,
            IsActive = announcement.IsActive,
            CreatedAt = announcement.CreatedAt.ToString("O"),
            ExpiresAt = announcement.ExpiresAt?.ToString("O"),
            CreatedBy = announcement.CreatedBy.ToString()
        };

        return Success(announcementDto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!Guid.TryParse(id, out var announcementId))
        {
            return Error("Invalid announcement ID");
        }

        var announcement = await _context.Announcements.FindAsync(announcementId);
        if (announcement == null)
        {
            return NotFound("Announcement not found");
        }

        _context.Announcements.Remove(announcement);
        await _context.SaveChangesAsync();

        return Success<object>(null, "Announcement deleted successfully");
    }
}

public class AnnouncementDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string? ExpiresAt { get; set; }
    public string? CreatedBy { get; set; }
}

public class CreateAnnouncementRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Type { get; set; }
    public bool? IsActive { get; set; }
    public string? ExpiresAt { get; set; }
}

public class UpdateAnnouncementRequest
{
    public string? Title { get; set; }
    public string? Message { get; set; }
    public string? Type { get; set; }
    public bool? IsActive { get; set; }
    public string? ExpiresAt { get; set; }
}
