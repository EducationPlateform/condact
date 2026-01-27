using EducationPlatform.Domain.Enums;

namespace EducationPlatform.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? ProfileImage { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<Group> GroupsAsTeacher { get; set; } = new List<Group>();
    public virtual ICollection<GroupStudent> GroupStudents { get; set; } = new List<GroupStudent>();
    public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    public virtual ICollection<Score> Scores { get; set; } = new List<Score>();
    public virtual ICollection<StudentAccess> StudentAccesses { get; set; } = new List<StudentAccess>();
    public virtual ICollection<AccessCode> AccessCodesCreated { get; set; } = new List<AccessCode>();
}
