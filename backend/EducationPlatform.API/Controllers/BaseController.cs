using Microsoft.AspNetCore.Mvc;
using EducationPlatform.API.Models;

namespace EducationPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected IActionResult Success<T>(T data, string? message = null)
    {
        return Ok(ApiResponse<T>.SuccessResponse(data, message));
    }

    protected IActionResult Error(string message, string? error = null)
    {
        return BadRequest(ApiResponse<object>.ErrorResponse(message, error));
    }

    protected IActionResult NotFound(string message = "Resource not found")
    {
        return NotFound(ApiResponse<object>.ErrorResponse(message));
    }

    protected IActionResult Unauthorized(string message = "Unauthorized")
    {
        return Unauthorized(ApiResponse<object>.ErrorResponse(message));
    }
}
