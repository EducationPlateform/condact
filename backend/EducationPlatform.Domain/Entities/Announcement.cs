namespace EducationPlatform.Domain.Entities;

public class Announcement
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "info"; // "info", "warning", "success"
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public Guid CreatedBy { get; set; }

    // Navigation properties
    public virtual User Creator { get; set; } = null!;
}
