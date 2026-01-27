namespace EducationPlatform.Domain.Entities;

public class Score
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid LectureId { get; set; }
    public decimal? HomeworkScore { get; set; }
    public decimal? ExamScore { get; set; }
    public decimal TotalScore { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public virtual User Student { get; set; } = null!;
    public virtual Lecture Lecture { get; set; } = null!;
}
