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
public class UsersController : BaseController
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetAll()
    {
        var isAdmin = User.IsInRole("Admin");
        var query = _context.Users.AsQueryable();

        // If not admin, only show students
        if (!isAdmin)
        {
            query = query.Where(u => u.Role == UserRole.Student);
        }

        var users = await query
            .Select(u => new UserDto
            {
                Id = u.Id.ToString(),
                Email = u.Email,
                Name = u.Name,
                Role = u.Role.ToString().ToLower(),
                ProfileImage = u.ProfileImage,
                CreatedAt = u.CreatedAt.ToString("O")
            })
            .ToListAsync();

        return Success(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!Guid.TryParse(id, out var userId))
        {
            return Error("Invalid user ID");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        // Check if user is accessing their own profile or is admin
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");
        
        if (!isAdmin && (currentUserIdClaim == null || currentUserIdClaim.Value != userId.ToString()))
        {
            return Unauthorized("You can only view your own profile");
        }

        var userDto = new UserDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            Name = user.Name,
            Role = user.Role.ToString().ToLower(),
            ProfileImage = user.ProfileImage,
            CreatedAt = user.CreatedAt.ToString("O")
        };

        return Success(userDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserRequest request)
    {
        if (!Guid.TryParse(id, out var userId))
        {
            return Error("Invalid user ID");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        // Check if user is updating their own profile or is admin
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");
        
        if (!isAdmin && currentUserId != userId.ToString())
        {
            return Unauthorized("You can only update your own profile");
        }

        // Only admin can change role
        if (request.Role != null && !isAdmin)
        {
            return Unauthorized("Only admins can change user roles");
        }

        if (!string.IsNullOrEmpty(request.Name))
        {
            user.Name = request.Name;
        }

        if (request.Role != null && isAdmin)
        {
            if (Enum.TryParse<UserRole>(request.Role, true, out var role))
            {
                user.Role = role;
            }
        }

        if (request.ProfileImage != null)
        {
            user.ProfileImage = request.ProfileImage;
        }

        await _context.SaveChangesAsync();

        var userDto = new UserDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            Name = user.Name,
            Role = user.Role.ToString().ToLower(),
            ProfileImage = user.ProfileImage,
            CreatedAt = user.CreatedAt.ToString("O")
        };

        return Success(userDto);
    }
}

public class UpdateUserRequest
{
    public string? Name { get; set; }
    public string? Role { get; set; }
    public string? ProfileImage { get; set; }
}
