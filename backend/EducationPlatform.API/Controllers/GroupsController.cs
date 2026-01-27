using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using EducationPlatform.Domain.Enums;
using EducationPlatform.Infrastructure.Data;
using EducationPlatform.API.Models;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GroupsController : BaseController
{
    private readonly ApplicationDbContext _context;

    public GroupsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateGroupRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role);

        var group = new Domain.Entities.Group
        {
            Id = Guid.NewGuid(),
            TeacherId = userRole == "Admin" && request.TeacherId.HasValue 
                ? request.TeacherId.Value 
                : userId,
            Name = request.Name,
            Description = request.Description,
            Schedule = System.Text.Json.JsonSerializer.Serialize(request.Schedule ?? new List<string>()),
            CreatedAt = DateTime.UtcNow
        };

        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        var groupDto = await MapToGroupDtoAsync(group);
        return Success(groupDto);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var groups = await _context.Groups
            .Include(g => g.Teacher)
            .Include(g => g.GroupStudents)
                .ThenInclude(gs => gs.Student)
            .ToListAsync();

        var groupDtos = new List<GroupDto>();
        foreach (var group in groups)
        {
            groupDtos.Add(await MapToGroupDtoAsync(group));
        }

        return Success(groupDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!Guid.TryParse(id, out var groupId))
        {
            return Error("Invalid group ID");
        }

        var group = await _context.Groups
            .Include(g => g.Teacher)
            .Include(g => g.GroupStudents)
                .ThenInclude(gs => gs.Student)
            .FirstOrDefaultAsync(g => g.Id == groupId);

        if (group == null)
        {
            return NotFound("Group not found");
        }

        var groupDto = await MapToGroupDtoAsync(group);
        return Success(groupDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateGroupRequest request)
    {
        if (!Guid.TryParse(id, out var groupId))
        {
            return Error("Invalid group ID");
        }

        var group = await _context.Groups.FindAsync(groupId);
        if (group == null)
        {
            return NotFound("Group not found");
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && group.TeacherId != userId)
        {
            return Unauthorized("You can only update your own groups");
        }

        if (!string.IsNullOrEmpty(request.Name))
        {
            group.Name = request.Name;
        }

        if (request.Description != null)
        {
            group.Description = request.Description;
        }

        if (request.Schedule != null)
        {
            group.Schedule = System.Text.Json.JsonSerializer.Serialize(request.Schedule);
        }

        await _context.SaveChangesAsync();

        var groupDto = await MapToGroupDtoAsync(group);
        return Success(groupDto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!Guid.TryParse(id, out var groupId))
        {
            return Error("Invalid group ID");
        }

        var group = await _context.Groups.FindAsync(groupId);
        if (group == null)
        {
            return NotFound("Group not found");
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && group.TeacherId != userId)
        {
            return Unauthorized("You can only delete your own groups");
        }

        _context.Groups.Remove(group);
        await _context.SaveChangesAsync();

        return Success<object>(null, "Group deleted successfully");
    }

    [HttpPost("{id}/students")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> AddStudent(string id, [FromBody] AddStudentRequest request)
    {
        if (!Guid.TryParse(id, out var groupId))
        {
            return Error("Invalid group ID");
        }

        if (!Guid.TryParse(request.StudentId, out var studentId))
        {
            return Error("Invalid student ID");
        }

        var group = await _context.Groups.FindAsync(groupId);
        if (group == null)
        {
            return NotFound("Group not found");
        }

        var exists = await _context.GroupStudents
            .AnyAsync(gs => gs.GroupId == groupId && gs.StudentId == studentId);

        if (exists)
        {
            return Error("Student is already in the group");
        }

        var groupStudent = new Domain.Entities.GroupStudent
        {
            GroupId = groupId,
            StudentId = studentId
        };

        _context.GroupStudents.Add(groupStudent);
        await _context.SaveChangesAsync();

        var groupDto = await MapToGroupDtoAsync(group);
        return Success(groupDto);
    }

    [HttpDelete("{id}/students")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> RemoveStudent(string id, [FromBody] RemoveStudentRequest request)
    {
        if (!Guid.TryParse(id, out var groupId))
        {
            return Error("Invalid group ID");
        }

        if (!Guid.TryParse(request.StudentId, out var studentId))
        {
            return Error("Invalid student ID");
        }

        var groupStudent = await _context.GroupStudents
            .FirstOrDefaultAsync(gs => gs.GroupId == groupId && gs.StudentId == studentId);

        if (groupStudent == null)
        {
            return NotFound("Student not found in group");
        }

        _context.GroupStudents.Remove(groupStudent);
        await _context.SaveChangesAsync();

        var group = await _context.Groups
            .Include(g => g.Teacher)
            .Include(g => g.GroupStudents)
                .ThenInclude(gs => gs.Student)
            .FirstOrDefaultAsync(g => g.Id == groupId);

        var groupDto = await MapToGroupDtoAsync(group!);
        return Success(groupDto);
    }

    private async Task<GroupDto> MapToGroupDtoAsync(Domain.Entities.Group group)
    {
        await _context.Entry(group).Reference(g => g.Teacher).LoadAsync();
        await _context.Entry(group).Collection(g => g.GroupStudents).LoadAsync();

        var students = new List<UserDto>();
        foreach (var gs in group.GroupStudents)
        {
            await _context.Entry(gs).Reference(gs => gs.Student).LoadAsync();
            students.Add(new UserDto
            {
                Id = gs.Student.Id.ToString(),
                Email = gs.Student.Email,
                Name = gs.Student.Name,
                Role = gs.Student.Role.ToString().ToLower(),
                ProfileImage = gs.Student.ProfileImage,
                CreatedAt = gs.Student.CreatedAt.ToString("O")
            });
        }

        return new GroupDto
        {
            Id = group.Id.ToString(),
            TeacherId = new UserDto
            {
                Id = group.Teacher.Id.ToString(),
                Email = group.Teacher.Email,
                Name = group.Teacher.Name,
                Role = group.Teacher.Role.ToString().ToLower(),
                ProfileImage = group.Teacher.ProfileImage,
                CreatedAt = group.Teacher.CreatedAt.ToString("O")
            },
            Name = group.Name,
            Description = group.Description,
            Students = students,
            Schedule = System.Text.Json.JsonSerializer.Deserialize<List<string>>(group.Schedule) ?? new List<string>(),
            CreatedAt = group.CreatedAt.ToString("O")
        };
    }
}

public class CreateGroupRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string>? Schedule { get; set; }
    public Guid? TeacherId { get; set; }
}

public class UpdateGroupRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public List<string>? Schedule { get; set; }
}

public class AddStudentRequest
{
    public string StudentId { get; set; } = string.Empty;
}

public class RemoveStudentRequest
{
    public string StudentId { get; set; } = string.Empty;
}

public class GroupDto
{
    public string Id { get; set; } = string.Empty;
    public UserDto TeacherId { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<UserDto> Students { get; set; } = new();
    public List<string> Schedule { get; set; } = new();
    public string CreatedAt { get; set; } = string.Empty;
}
