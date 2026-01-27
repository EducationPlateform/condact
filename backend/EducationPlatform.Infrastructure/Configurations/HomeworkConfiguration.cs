using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class HomeworkConfiguration : IEntityTypeConfiguration<Homework>
{
    public void Configure(EntityTypeBuilder<Homework> builder)
    {
        builder.HasKey(h => h.Id);
        builder.Property(h => h.LectureId).IsRequired();
        builder.Property(h => h.Title).IsRequired().HasMaxLength(255);
        builder.Property(h => h.Description).HasMaxLength(2000);
        builder.Property(h => h.Questions).IsRequired();
        builder.Property(h => h.MaxScore).IsRequired().HasPrecision(18, 2);
        builder.Property(h => h.CreatedAt).IsRequired();

        // Relationships
        builder.HasMany(h => h.Submissions)
            .WithOne(s => s.Homework)
            .HasForeignKey(s => s.HomeworkId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
