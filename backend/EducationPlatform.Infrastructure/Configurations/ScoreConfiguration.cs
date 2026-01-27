using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class ScoreConfiguration : IEntityTypeConfiguration<Score>
{
    public void Configure(EntityTypeBuilder<Score> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.StudentId).IsRequired();
        builder.Property(s => s.LectureId).IsRequired();
        builder.Property(s => s.HomeworkScore).HasPrecision(18, 2);
        builder.Property(s => s.ExamScore).HasPrecision(18, 2);
        builder.Property(s => s.TotalScore).IsRequired().HasPrecision(18, 2);
        builder.Property(s => s.UpdatedAt).IsRequired();

        // Unique constraint on StudentId + LectureId
        builder.HasIndex(s => new { s.StudentId, s.LectureId }).IsUnique();
    }
}
