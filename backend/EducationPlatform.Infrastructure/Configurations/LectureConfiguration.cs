using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class LectureConfiguration : IEntityTypeConfiguration<Lecture>
{
    public void Configure(EntityTypeBuilder<Lecture> builder)
    {
        builder.HasKey(l => l.Id);
        builder.Property(l => l.GroupId).IsRequired();
        builder.Property(l => l.Title).IsRequired().HasMaxLength(255);
        builder.Property(l => l.Description).HasMaxLength(2000);
        builder.Property(l => l.IsPublished).IsRequired();
        builder.Property(l => l.Order).IsRequired();
        builder.Property(l => l.CreatedAt).IsRequired();

        // Relationships
        builder.HasOne(l => l.Video)
            .WithOne(v => v.Lecture)
            .HasForeignKey<Video>(v => v.LectureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(l => l.PdfFiles)
            .WithOne(pf => pf.Lecture)
            .HasForeignKey(pf => pf.LectureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(l => l.Homeworks)
            .WithOne(h => h.Lecture)
            .HasForeignKey(h => h.LectureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(l => l.Exams)
            .WithOne(e => e.Lecture)
            .HasForeignKey(e => e.LectureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(l => l.Scores)
            .WithOne(s => s.Lecture)
            .HasForeignKey(s => s.LectureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(l => l.StudentAccesses)
            .WithOne(sa => sa.Lecture)
            .HasForeignKey(sa => sa.LectureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(l => l.AccessCodes)
            .WithOne(ac => ac.Lecture)
            .HasForeignKey(ac => ac.LectureId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
