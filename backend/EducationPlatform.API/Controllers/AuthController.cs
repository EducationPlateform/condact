using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EducationPlatform.API.Models;
using EducationPlatform.API.Services;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : BaseController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return Error("Invalid request data");
        }

        var response = await _authService.LoginAsync(request);
        if (response == null)
        {
            return Error("Invalid email or password");
        }

        return Success(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return Error("Invalid request data");
        }

        var response = await _authService.RegisterAsync(request);
        if (response == null)
        {
            return Error("Registration failed. Email may already be in use or invalid role.");
        }

        return Success(response);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMe()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized("Invalid token");
        }

        var user = await _authService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        return Success(user);
    }
}
