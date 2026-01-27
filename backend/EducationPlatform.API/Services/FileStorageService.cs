using Microsoft.AspNetCore.Http;

namespace EducationPlatform.API.Services;

public interface IFileStorageService
{
    Task<string> SaveVideoAsync(IFormFile file, Guid lectureId);
    Task<string> SavePdfAsync(IFormFile file, Guid lectureId);
    Task<bool> DeleteFileAsync(string filePath);
    Task<FileStream?> GetFileStreamAsync(string filePath);
    string GetFileUrl(string relativePath);
}

public class FileStorageService : IFileStorageService
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<FileStorageService> _logger;

    public FileStorageService(
        IConfiguration configuration,
        IWebHostEnvironment environment,
        ILogger<FileStorageService> logger)
    {
        _configuration = configuration;
        _environment = environment;
        _logger = logger;
    }

    public async Task<string> SaveVideoAsync(IFormFile file, Guid lectureId)
    {
        var videoPath = _configuration["FileStorage:VideoPath"] ?? "wwwroot/videos";
        var fullPath = Path.Combine(_environment.ContentRootPath, videoPath);
        Directory.CreateDirectory(fullPath);

        var fileName = $"{lectureId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(fullPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine(videoPath, fileName).Replace('\\', '/');
    }

    public async Task<string> SavePdfAsync(IFormFile file, Guid lectureId)
    {
        var pdfPath = _configuration["FileStorage:PdfPath"] ?? "wwwroot/pdfs";
        var fullPath = Path.Combine(_environment.ContentRootPath, pdfPath);
        Directory.CreateDirectory(fullPath);

        var fileName = $"{lectureId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(fullPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine(pdfPath, fileName).Replace('\\', '/');
    }

    public Task<bool> DeleteFileAsync(string filePath)
    {
        try
        {
            var fullPath = Path.Combine(_environment.ContentRootPath, filePath);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FilePath}", filePath);
            return Task.FromResult(false);
        }
    }

    public Task<FileStream?> GetFileStreamAsync(string filePath)
    {
        try
        {
            var fullPath = Path.Combine(_environment.ContentRootPath, filePath);
            if (File.Exists(fullPath))
            {
                return Task.FromResult<FileStream?>(new FileStream(fullPath, FileMode.Open, FileAccess.Read));
            }
            return Task.FromResult<FileStream?>(null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting file stream: {FilePath}", filePath);
            return Task.FromResult<FileStream?>(null);
        }
    }

    public string GetFileUrl(string relativePath)
    {
        return $"/{relativePath}";
    }
}
