using EducationPlatform.Domain.Enums;

namespace EducationPlatform.Domain.Entities;

public class Submission
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid? HomeworkId { get; set; }
    public Guid? ExamId { get; set; }
    public SubmissionType Type { get; set; }
    public string Answers { get; set; } = "{}"; // JSON object
    public decimal? Score { get; set; }
    public DateTime SubmittedAt { get; set; }
    public int Attempts { get; set; }

    // Navigation properties
    public virtual User Student { get; set; } = null!;
    public virtual Homework? Homework { get; set; }
    public virtual Exam? Exam { get; set; }
}
