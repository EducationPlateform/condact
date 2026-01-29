using EducationPlatform.Domain.Entities;
using EducationPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace EducationPlatform.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(ApplicationDbContext context)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Check if admin user already exists
        if (await context.Users.AnyAsync(u => u.Role == UserRole.Admin))
        {
            return; // Database already seeded
        }

        // Create default admin user
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@educationplatform.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Name = "Administrator",
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(adminUser);
        await context.SaveChangesAsync();
    }
}
