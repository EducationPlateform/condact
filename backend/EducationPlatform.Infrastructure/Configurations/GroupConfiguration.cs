using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder.HasKey(g => g.Id);
        builder.Property(g => g.TeacherId).IsRequired();
        builder.Property(g => g.Name).IsRequired().HasMaxLength(255);
        builder.Property(g => g.Description).HasMaxLength(1000);
        builder.Property(g => g.Schedule).IsRequired().HasMaxLength(500);
        builder.Property(g => g.CreatedAt).IsRequired();

        // Relationships
        builder.HasMany(g => g.GroupStudents)
            .WithOne(gs => gs.Group)
            .HasForeignKey(gs => gs.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(g => g.Lectures)
            .WithOne(l => l.Group)
            .HasForeignKey(l => l.GroupId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
