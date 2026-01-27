namespace EducationPlatform.Domain.Entities;

public class AccessCode
{
    public Guid Id { get; set; }
    public Guid LectureId { get; set; }
    public string Code { get; set; } = string.Empty;
    public int MaxViews { get; set; } = 3;
    public int CurrentViews { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public Guid CreatedBy { get; set; }

    // Navigation properties
    public virtual Lecture Lecture { get; set; } = null!;
    public virtual User Creator { get; set; } = null!;
    public virtual ICollection<StudentAccess> StudentAccesses { get; set; } = new List<StudentAccess>();
}
