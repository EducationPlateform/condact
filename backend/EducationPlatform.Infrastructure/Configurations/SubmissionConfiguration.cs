using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Configurations;

public class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
{
    public void Configure(EntityTypeBuilder<Submission> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.StudentId).IsRequired();
        builder.Property(s => s.Type).IsRequired();
        builder.Property(s => s.Answers).IsRequired();
        builder.Property(s => s.Score).HasPrecision(18, 2);
        builder.Property(s => s.SubmittedAt).IsRequired();
        builder.Property(s => s.Attempts).IsRequired();
    }
}
