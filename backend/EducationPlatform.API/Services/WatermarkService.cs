using System.Text;
using System.Text.Json;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.Fonts;
using EducationPlatform.Infrastructure.Data;

namespace EducationPlatform.API.Services;

public interface IWatermarkService
{
    Task<byte[]> GenerateWatermarkImageAsync(string studentId, string studentEmail, DateTime timestamp);
    string GetWatermarkOverlayData(Guid studentId, string studentEmail);
    Task<string> EmbedWatermarkAsync(string videoPath, Guid studentId, string studentEmail, string ffmpegPath);
}

public class WatermarkService : IWatermarkService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WatermarkService> _logger;

    public WatermarkService(
        ApplicationDbContext context,
        IConfiguration configuration,
        ILogger<WatermarkService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<byte[]> GenerateWatermarkImageAsync(string studentId, string studentEmail, DateTime timestamp)
    {
        var opacity = _configuration.GetValue<float>("WatermarkSettings:Opacity", 0.3f);
        var width = 400;
        var height = 100;

        using var image = new Image<Rgba32>(width, height);
        
        // Fill with transparent background
        image.Mutate(ctx => ctx.Fill(Color.Transparent));

        // Create watermark text
        var watermarkText = $"{studentId}\n{studentEmail}\n{timestamp:yyyy-MM-dd HH:mm:ss}";
        
        // Get system font or use default
        Font font;
        try
        {
            font = SystemFonts.CreateFont("Arial", 12, FontStyle.Bold);
        }
        catch
        {
            var families = SystemFonts.Families.ToList();
            if (families.Count > 0)
            {
                font = families[0].CreateFont(12, FontStyle.Bold);
            }
            else
            {
                // Fallback - create a simple font
                font = SystemFonts.CreateFont("Arial", 12);
            }
        }
        var textOptions = new RichTextOptions(font!)
        {
            Origin = new PointF(10, 10),
            HorizontalAlignment = HorizontalAlignment.Left,
            VerticalAlignment = VerticalAlignment.Top
        };

        // Draw watermark with opacity
        var alpha = (byte)(255 * opacity);
        var color = new Color(new Rgba32(255, 255, 255, alpha));
        image.Mutate(ctx => ctx.DrawText(textOptions, watermarkText, color));

        // Convert to byte array
        using var ms = new MemoryStream();
        await image.SaveAsync(ms, new PngEncoder());
        return ms.ToArray();
    }

    public string GetWatermarkOverlayData(Guid studentId, string studentEmail)
    {
        var watermarkData = new
        {
            studentId = studentId.ToString(),
            studentEmail = studentEmail,
            timestamp = DateTime.UtcNow.ToString("O"),
            positions = new[] { "top-left", "top-right", "bottom-left", "bottom-right", "center" }
        };

        return JsonSerializer.Serialize(watermarkData);
    }

    public async Task<string> EmbedWatermarkAsync(string videoPath, Guid studentId, string studentEmail, string ffmpegPath)
    {
        try
        {
            var user = await _context.Users.FindAsync(studentId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            // Generate watermark image
            var watermarkImage = await GenerateWatermarkImageAsync(studentId.ToString(), studentEmail, DateTime.UtcNow);
            
            // Save watermark image temporarily
            var watermarkPath = Path.Combine(Path.GetTempPath(), $"watermark_{studentId}_{Guid.NewGuid()}.png");
            await File.WriteAllBytesAsync(watermarkPath, watermarkImage);

            // Generate output path
            var outputPath = Path.Combine(
                Path.GetDirectoryName(videoPath)!,
                $"{Path.GetFileNameWithoutExtension(videoPath)}_watermarked_{studentId}{Path.GetExtension(videoPath)}"
            );

            // FFmpeg command to embed watermark
            // Note: This requires FFmpeg to be installed and accessible
            var ffmpegArgs = $"-i \"{videoPath}\" -i \"{watermarkPath}\" " +
                           $"-filter_complex \"[0:v][1:v]overlay=W-w-10:H-h-10:format=auto\" " +
                           $"-codec:a copy \"{outputPath}\" -y";

            var processStartInfo = new System.Diagnostics.ProcessStartInfo
            {
                FileName = ffmpegPath,
                Arguments = ffmpegArgs,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            };

            using var process = System.Diagnostics.Process.Start(processStartInfo);
            if (process == null)
            {
                throw new InvalidOperationException("Failed to start FFmpeg process");
            }

            await process.WaitForExitAsync();

            // Clean up temporary watermark file
            if (File.Exists(watermarkPath))
            {
                File.Delete(watermarkPath);
            }

            if (process.ExitCode != 0)
            {
                var error = await process.StandardError.ReadToEndAsync();
                _logger.LogError("FFmpeg error: {Error}", error);
                throw new InvalidOperationException($"FFmpeg processing failed: {error}");
            }

            return outputPath;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error embedding watermark in video");
            throw;
        }
    }
}
