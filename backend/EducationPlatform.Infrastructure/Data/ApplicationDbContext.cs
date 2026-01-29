using Microsoft.EntityFrameworkCore;
using EducationPlatform.Domain.Entities;
using EducationPlatform.Infrastructure.Configurations;

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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all entity configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
