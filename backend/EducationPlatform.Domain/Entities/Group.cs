namespace EducationPlatform.Domain.Entities;

public class Group
{
    public Guid Id { get; set; }
    public Guid TeacherId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Schedule { get; set; } = "[]"; // JSON array of days
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public virtual User Teacher { get; set; } = null!;
    public virtual ICollection<GroupStudent> GroupStudents { get; set; } = new List<GroupStudent>();
    public virtual ICollection<Lecture> Lectures { get; set; } = new List<Lecture>();
}
