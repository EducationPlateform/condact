using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class AccessCodeConfiguration : IEntityTypeConfiguration<AccessCode>
{
    public void Configure(EntityTypeBuilder<AccessCode> builder)
    {
        builder.HasKey(ac => ac.Id);
        builder.Property(ac => ac.LectureId).IsRequired();
        builder.Property(ac => ac.Code).IsRequired().HasMaxLength(50);
        builder.HasIndex(ac => ac.Code).IsUnique();
        builder.Property(ac => ac.MaxViews).IsRequired();
        builder.Property(ac => ac.CurrentViews).IsRequired();
        builder.Property(ac => ac.CreatedBy).IsRequired();
    }
}
