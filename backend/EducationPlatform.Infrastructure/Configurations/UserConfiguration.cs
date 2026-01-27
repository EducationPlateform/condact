using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(255);
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
        builder.Property(u => u.Name).IsRequired().HasMaxLength(255);
        builder.Property(u => u.Role).IsRequired();
        builder.Property(u => u.ProfileImage).HasMaxLength(500);
        builder.Property(u => u.CreatedAt).IsRequired();

        // Relationships
        builder.HasMany(u => u.GroupsAsTeacher)
            .WithOne(g => g.Teacher)
            .HasForeignKey(g => g.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.GroupStudents)
            .WithOne(gs => gs.Student)
            .HasForeignKey(gs => gs.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.Submissions)
            .WithOne(s => s.Student)
            .HasForeignKey(s => s.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.Scores)
            .WithOne(s => s.Student)
            .HasForeignKey(s => s.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.StudentAccesses)
            .WithOne(sa => sa.Student)
            .HasForeignKey(sa => sa.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.AccessCodesCreated)
            .WithOne(ac => ac.Creator)
            .HasForeignKey(ac => ac.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
