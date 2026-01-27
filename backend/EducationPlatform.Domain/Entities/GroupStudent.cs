namespace EducationPlatform.Domain.Entities;

public class GroupStudent
{
    public Guid GroupId { get; set; }
    public Guid StudentId { get; set; }

    // Navigation properties
    public virtual Group Group { get; set; } = null!;
    public virtual User Student { get; set; } = null!;
}
