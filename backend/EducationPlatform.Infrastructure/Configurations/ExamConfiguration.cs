using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class ExamConfiguration : IEntityTypeConfiguration<Exam>
{
    public void Configure(EntityTypeBuilder<Exam> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.LectureId).IsRequired();
        builder.Property(e => e.Title).IsRequired().HasMaxLength(255);
        builder.Property(e => e.Description).HasMaxLength(2000);
        builder.Property(e => e.Questions).IsRequired();
        builder.Property(e => e.MaxScore).IsRequired().HasPrecision(18, 2);
        builder.Property(e => e.TimeLimit).IsRequired();
        builder.Property(e => e.IsActive).IsRequired();
        builder.Property(e => e.CreatedAt).IsRequired();

        // Relationships
        builder.HasMany(e => e.Submissions)
            .WithOne(s => s.Exam)
            .HasForeignKey(s => s.ExamId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
