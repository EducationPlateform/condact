namespace EducationPlatform.Domain.Entities;

public class PdfFile
{
    public Guid Id { get; set; }
    public Guid LectureId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public DateTime UploadDate { get; set; }

    // Navigation properties
    public virtual Lecture Lecture { get; set; } = null!;
}
