namespace EducationPlatform.Domain.Entities;

public class Homework
{
    public Guid Id { get; set; }
    public Guid LectureId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Questions { get; set; } = "[]"; // JSON array
    public decimal MaxScore { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public virtual Lecture Lecture { get; set; } = null!;
    public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
