using Microsoft.EntityFrameworkCore;
using EducationPlatform.Domain.Entities;
using EducationPlatform.Infrastructure.Data;

namespace EducationPlatform.API.Services;

public interface ISecurityViolationService
{
    Task LogViolationAsync(Guid studentId, Guid lectureId, Guid? videoId, string violationType, string details, string? ipAddress = null, string? userAgent = null);
    Task<List<SecurityViolation>> GetViolationsByStudentAsync(Guid studentId);
    Task<List<SecurityViolation>> GetViolationsByLectureAsync(Guid lectureId);
    Task<List<SecurityViolation>> GetViolationsByVideoAsync(Guid videoId);
    Task<int> GetViolationCountAsync(Guid studentId, Guid lectureId);
}

public class SecurityViolationService : ISecurityViolationService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SecurityViolationService> _logger;

    public SecurityViolationService(ApplicationDbContext context, ILogger<SecurityViolationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task LogViolationAsync(Guid studentId, Guid lectureId, Guid? videoId, string violationType, string details, string? ipAddress = null, string? userAgent = null)
    {
        try
        {
            var violation = new SecurityViolation
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                LectureId = lectureId,
                VideoId = videoId,
                ViolationType = violationType,
                Details = details,
                DetectedAt = DateTime.UtcNow,
                IpAddress = ipAddress,
                UserAgent = userAgent
            };

            _context.SecurityViolations.Add(violation);
            await _context.SaveChangesAsync();

            _logger.LogWarning("Security violation logged: StudentId={StudentId}, LectureId={LectureId}, Type={Type}",
                studentId, lectureId, violationType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging security violation");
            throw;
        }
    }

    public async Task<List<SecurityViolation>> GetViolationsByStudentAsync(Guid studentId)
    {
        return await _context.SecurityViolations
            .Where(v => v.StudentId == studentId)
            .OrderByDescending(v => v.DetectedAt)
            .ToListAsync();
    }

    public async Task<List<SecurityViolation>> GetViolationsByLectureAsync(Guid lectureId)
    {
        return await _context.SecurityViolations
            .Where(v => v.LectureId == lectureId)
            .OrderByDescending(v => v.DetectedAt)
            .ToListAsync();
    }

    public async Task<List<SecurityViolation>> GetViolationsByVideoAsync(Guid videoId)
    {
        return await _context.SecurityViolations
            .Where(v => v.VideoId == videoId)
            .OrderByDescending(v => v.DetectedAt)
            .ToListAsync();
    }

    public async Task<int> GetViolationCountAsync(Guid studentId, Guid lectureId)
    {
        return await _context.SecurityViolations
            .CountAsync(v => v.StudentId == studentId && v.LectureId == lectureId);
    }
}
