using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class VideoConfiguration : IEntityTypeConfiguration<Video>
{
    public void Configure(EntityTypeBuilder<Video> builder)
    {
        builder.HasKey(v => v.Id);
        builder.Property(v => v.LectureId).IsRequired();
        builder.Property(v => v.FileUrl).IsRequired().HasMaxLength(1000);
        builder.Property(v => v.FileName).IsRequired().HasMaxLength(255);
        builder.Property(v => v.StreamingUrl).HasMaxLength(1000);
        builder.Property(v => v.SecurityConfig).IsRequired().HasMaxLength(2000);
        builder.Property(v => v.UploadDate).IsRequired();
    }
}
