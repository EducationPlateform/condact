using Microsoft.EntityFrameworkCore;
using EducationPlatform.Domain.Entities;
using EducationPlatform.Infrastructure.Data;

namespace EducationPlatform.API.Services;

public interface IAccessControlService
{
    Task<StudentAccess?> GrantAccessAsync(Guid studentId, Guid lectureId, int? maxViews, string grantedBy);
    Task<StudentAccess?> ExtendAccessAsync(Guid studentId, Guid lectureId, int additionalViews);
    Task<StudentAccess?> CheckAccessAsync(Guid studentId, Guid lectureId);
    Task<StudentAccess?> RecordViewAsync(Guid studentId, Guid lectureId);
    Task<StudentAccess?> RedeemCodeAsync(Guid studentId, Guid lectureId, string code);
    Task<AccessCode> GenerateCodeAsync(Guid lectureId, Guid createdBy, int? maxViews, DateTime? expiresAt);
}

public class AccessControlService : IAccessControlService
{
    private readonly ApplicationDbContext _context;

    public AccessControlService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentAccess?> GrantAccessAsync(Guid studentId, Guid lectureId, int? maxViews, string grantedBy)
    {
        var existingAccess = await _context.StudentAccesses
            .FirstOrDefaultAsync(sa => sa.StudentId == studentId && sa.LectureId == lectureId);

        if (existingAccess != null)
        {
            existingAccess.MaxViews += maxViews ?? 3;
            await _context.SaveChangesAsync();
            return existingAccess;
        }

        var access = new StudentAccess
        {
            Id = Guid.NewGuid(),
            StudentId = studentId,
            LectureId = lectureId,
            MaxViews = maxViews ?? 3,
            CurrentViews = 0,
            GrantedBy = grantedBy
        };

        _context.StudentAccesses.Add(access);
        await _context.SaveChangesAsync();
        return access;
    }

    public async Task<StudentAccess?> ExtendAccessAsync(Guid studentId, Guid lectureId, int additionalViews)
    {
        var access = await _context.StudentAccesses
            .FirstOrDefaultAsync(sa => sa.StudentId == studentId && sa.LectureId == lectureId);

        if (access == null)
        {
            return null;
        }

        access.MaxViews += additionalViews;
        await _context.SaveChangesAsync();
        return access;
    }

    public async Task<StudentAccess?> CheckAccessAsync(Guid studentId, Guid lectureId)
    {
        return await _context.StudentAccesses
            .FirstOrDefaultAsync(sa => sa.StudentId == studentId && sa.LectureId == lectureId);
    }

    public async Task<StudentAccess?> RecordViewAsync(Guid studentId, Guid lectureId)
    {
        var access = await _context.StudentAccesses
            .FirstOrDefaultAsync(sa => sa.StudentId == studentId && sa.LectureId == lectureId);

        if (access == null)
        {
            return null;
        }

        if (access.CurrentViews >= access.MaxViews)
        {
            return null; // No views remaining
        }

        access.CurrentViews++;
        access.LastViewedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return access;
    }

    public async Task<StudentAccess?> RedeemCodeAsync(Guid studentId, Guid lectureId, string code)
    {
        var accessCode = await _context.AccessCodes
            .FirstOrDefaultAsync(ac => ac.Code == code && ac.LectureId == lectureId);

        if (accessCode == null)
        {
            return null;
        }

        if (accessCode.ExpiresAt.HasValue && accessCode.ExpiresAt.Value < DateTime.UtcNow)
        {
            return null; // Code expired
        }

        if (accessCode.CurrentViews >= accessCode.MaxViews)
        {
            return null; // Code exhausted
        }

        var existingAccess = await _context.StudentAccesses
            .FirstOrDefaultAsync(sa => sa.StudentId == studentId && sa.LectureId == lectureId);

        if (existingAccess != null)
        {
            existingAccess.MaxViews += accessCode.MaxViews;
            existingAccess.AccessCodeId = accessCode.Id;
            accessCode.CurrentViews++;
            await _context.SaveChangesAsync();
            return existingAccess;
        }

        var access = new StudentAccess
        {
            Id = Guid.NewGuid(),
            StudentId = studentId,
            LectureId = lectureId,
            AccessCodeId = accessCode.Id,
            MaxViews = accessCode.MaxViews,
            CurrentViews = 0,
            GrantedBy = "code"
        };

        accessCode.CurrentViews++;
        _context.StudentAccesses.Add(access);
        await _context.SaveChangesAsync();
        return access;
    }

    public async Task<AccessCode> GenerateCodeAsync(Guid lectureId, Guid createdBy, int? maxViews, DateTime? expiresAt)
    {
        var code = $"LECTURE-{Guid.NewGuid().ToString("N")[..8].ToUpper()}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";

        var accessCode = new AccessCode
        {
            Id = Guid.NewGuid(),
            LectureId = lectureId,
            Code = code,
            MaxViews = maxViews ?? 3,
            CurrentViews = 0,
            ExpiresAt = expiresAt,
            CreatedBy = createdBy
        };

        _context.AccessCodes.Add(accessCode);
        await _context.SaveChangesAsync();
        return accessCode;
    }
}
