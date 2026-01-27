namespace EducationPlatform.Domain.Entities;

public class StudentAccess
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid LectureId { get; set; }
    public Guid? AccessCodeId { get; set; }
    public int MaxViews { get; set; }
    public int CurrentViews { get; set; }
    public DateTime? LastViewedAt { get; set; }
    public string GrantedBy { get; set; } = string.Empty; // "admin" or "teacher"

    // Navigation properties
    public virtual User Student { get; set; } = null!;
    public virtual Lecture Lecture { get; set; } = null!;
    public virtual AccessCode? AccessCode { get; set; }
}
