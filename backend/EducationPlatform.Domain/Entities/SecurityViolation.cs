namespace EducationPlatform.Domain.Entities;

public class SecurityViolation
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid LectureId { get; set; }
    public Guid? VideoId { get; set; }
    public string ViolationType { get; set; } = string.Empty; // "Screenshot", "ScreenRecording", "DevTools", "TabSwitch"
    public string Details { get; set; } = "{}"; // JSON string with additional info
    public DateTime DetectedAt { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }

    // Navigation properties
    public virtual User Student { get; set; } = null!;
    public virtual Lecture Lecture { get; set; } = null!;
    public virtual Video? Video { get; set; }
}
