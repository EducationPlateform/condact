using Microsoft.EntityFrameworkCore;
using EducationPlatform.Domain.Entities;

namespace EducationPlatform.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<GroupStudent> GroupStudents { get; set; }
    public DbSet<Lecture> Lectures { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<PdfFile> PdfFiles { get; set; }
    public DbSet<Homework> Homeworks { get; set; }
    public DbSet<Exam> Exams { get; set; }
    public DbSet<Submission> Submissions { get; set; }
    public DbSet<Score> Scores { get; set; }
    public DbSet<StudentAccess> StudentAccesses { get; set; }
    public DbSet<AccessCode> AccessCodes { get; set; }
    public DbSet<SecurityViolation> SecurityViolations { get; set; }
    public DbSet<Announcement> Announcements { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all entity configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Global DateTime UTC Conversion
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(
                        new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(
                            v => v.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v, DateTimeKind.Utc),
                            v => v));
                }
            }
        }
    }
}
