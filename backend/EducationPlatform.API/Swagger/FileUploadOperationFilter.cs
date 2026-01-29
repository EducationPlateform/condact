using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace EducationPlatform.API.Swagger;

/// <summary>
/// Documents the video file upload for the Videos Upload endpoint so Swagger UI shows a file input.
/// The action uses [FromForm] string lectureId and reads the file from Request.Form.Files.GetFile("video")
/// to avoid Swashbuckle's IFormFile parameter generation error.
/// </summary>
public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var method = context.ApiDescription.HttpMethod;
        var path = context.ApiDescription.RelativePath ?? "";
        if (method != "POST" || !path.Contains("upload", StringComparison.OrdinalIgnoreCase))
            return;

        operation.RequestBody = new OpenApiRequestBody
        {
            Required = true,
            Content =
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Required = new HashSet<string> { "video", "lectureId" },
                        Properties =
                        {
                            ["video"] = new OpenApiSchema
                            {
                                Type = "string",
                                Format = "binary",
                                Description = "Video file to upload"
                            },
                            ["lectureId"] = new OpenApiSchema
                            {
                                Type = "string",
                                Format = "uuid",
                                Description = "Lecture ID"
                            }
                        }
                    }
                }
            }
        };
    }
}
