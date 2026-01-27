using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class GroupStudentConfiguration : IEntityTypeConfiguration<GroupStudent>
{
    public void Configure(EntityTypeBuilder<GroupStudent> builder)
    {
        builder.HasKey(gs => new { gs.GroupId, gs.StudentId });

        builder.HasIndex(gs => gs.GroupId);
        builder.HasIndex(gs => gs.StudentId);
    }
}
