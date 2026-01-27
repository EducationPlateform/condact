using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class SecurityViolationConfiguration : IEntityTypeConfiguration<SecurityViolation>
{
    public void Configure(EntityTypeBuilder<SecurityViolation> builder)
    {
        builder.HasKey(sv => sv.Id);
        builder.Property(sv => sv.StudentId).IsRequired();
        builder.Property(sv => sv.LectureId).IsRequired();
        builder.Property(sv => sv.ViolationType).IsRequired().HasMaxLength(50);
        builder.Property(sv => sv.Details).IsRequired();
        builder.Property(sv => sv.DetectedAt).IsRequired();
        builder.Property(sv => sv.IpAddress).HasMaxLength(50);
        builder.Property(sv => sv.UserAgent).HasMaxLength(500);

        // Relationships
        builder.HasOne(sv => sv.Student)
            .WithMany()
            .HasForeignKey(sv => sv.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(sv => sv.Lecture)
            .WithMany()
            .HasForeignKey(sv => sv.LectureId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(sv => sv.Video)
            .WithMany()
            .HasForeignKey(sv => sv.VideoId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(sv => sv.StudentId);
        builder.HasIndex(sv => sv.LectureId);
        builder.HasIndex(sv => sv.DetectedAt);
    }
}
