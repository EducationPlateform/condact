namespace EducationPlatform.Domain.Entities;

public class Video
{
    public Guid Id { get; set; }
    public Guid LectureId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public int? Duration { get; set; } // in seconds
    public DateTime UploadDate { get; set; }
    public string? StreamingUrl { get; set; }
    public string SecurityConfig { get; set; } = "{}"; // JSON string

    // Navigation properties
    public virtual Lecture Lecture { get; set; } = null!;
}
