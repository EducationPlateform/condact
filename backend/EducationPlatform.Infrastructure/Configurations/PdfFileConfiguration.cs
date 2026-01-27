using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class PdfFileConfiguration : IEntityTypeConfiguration<PdfFile>
{
    public void Configure(EntityTypeBuilder<PdfFile> builder)
    {
        builder.HasKey(pf => pf.Id);
        builder.Property(pf => pf.LectureId).IsRequired();
        builder.Property(pf => pf.FileName).IsRequired().HasMaxLength(255);
        builder.Property(pf => pf.FileUrl).IsRequired().HasMaxLength(1000);
        builder.Property(pf => pf.UploadDate).IsRequired();
    }
}
