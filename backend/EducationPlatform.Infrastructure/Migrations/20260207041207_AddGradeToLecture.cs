using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EducationPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGradeToLecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Grade",
                table: "Lectures",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Lectures");
        }
    }
}
