using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class StudentAccessConfiguration : IEntityTypeConfiguration<StudentAccess>
{
    public void Configure(EntityTypeBuilder<StudentAccess> builder)
    {
        builder.HasKey(sa => sa.Id);
        builder.Property(sa => sa.StudentId).IsRequired();
        builder.Property(sa => sa.LectureId).IsRequired();
        builder.Property(sa => sa.MaxViews).IsRequired();
        builder.Property(sa => sa.CurrentViews).IsRequired();
        builder.Property(sa => sa.GrantedBy).IsRequired().HasMaxLength(50);

        // Unique constraint on StudentId + LectureId
        builder.HasIndex(sa => new { sa.StudentId, sa.LectureId }).IsUnique();
    }
}
