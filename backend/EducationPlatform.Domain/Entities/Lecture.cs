namespace EducationPlatform.Domain.Entities;

public class Lecture
{
    public Guid Id { get; set; }
    public Guid GroupId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? VideoId { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public bool IsPublished { get; set; }
    public int Order { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Grade { get; set; } = string.Empty;

    // Navigation properties
    public virtual Group Group { get; set; } = null!;
    public virtual Video? Video { get; set; }
    public virtual ICollection<PdfFile> PdfFiles { get; set; } = new List<PdfFile>();
    public virtual ICollection<Homework> Homeworks { get; set; } = new List<Homework>();
    public virtual ICollection<Exam> Exams { get; set; } = new List<Exam>();
    public virtual ICollection<Score> Scores { get; set; } = new List<Score>();
    public virtual ICollection<StudentAccess> StudentAccesses { get; set; } = new List<StudentAccess>();
    public virtual ICollection<AccessCode> AccessCodes { get; set; } = new List<AccessCode>();
}
