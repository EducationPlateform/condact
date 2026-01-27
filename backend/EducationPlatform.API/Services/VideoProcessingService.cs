using EducationPlatform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationPlatform.API.Services;

public interface IVideoProcessingService
{
    Task<ProcessedVideo> ProcessVideoAsync(string inputPath, Guid videoId);
    Task<string> GenerateHlsManifestAsync(string videoPath, Guid videoId, string ffmpegPath);
    Task<string> GenerateDashManifestAsync(string videoPath, Guid videoId, string ffmpegPath);
    Task<int?> GetVideoDurationAsync(string videoPath, string ffmpegPath);
}

public class VideoProcessingService : IVideoProcessingService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<VideoProcessingService> _logger;
    private readonly IWebHostEnvironment _environment;

    public VideoProcessingService(
        ApplicationDbContext context,
        IConfiguration configuration,
        ILogger<VideoProcessingService> logger,
        IWebHostEnvironment environment)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _environment = environment;
    }

    public async Task<ProcessedVideo> ProcessVideoAsync(string inputPath, Guid videoId)
    {
        var ffmpegPath = _configuration["VideoProcessing:FfmpegPath"] ?? "ffmpeg";
        var enableHls = _configuration.GetValue<bool>("VideoProcessing:EnableHls", true);
        var enableDash = _configuration.GetValue<bool>("VideoProcessing:EnableDash", true);

        var outputDir = Path.Combine(
            _environment.ContentRootPath,
            "wwwroot",
            "processed",
            videoId.ToString()
        );
        Directory.CreateDirectory(outputDir);

        var processedVideo = new ProcessedVideo
        {
            OriginalPath = inputPath,
            OutputDirectory = outputDir,
            HlsManifestPath = null,
            DashManifestPath = null
        };

        // Get video duration
        var duration = await GetVideoDurationAsync(inputPath, ffmpegPath);
        if (duration.HasValue)
        {
            var video = await _context.Videos.FindAsync(videoId);
            if (video != null)
            {
                video.Duration = duration.Value;
                await _context.SaveChangesAsync();
            }
        }

        // Generate HLS manifest if enabled
        if (enableHls)
        {
            try
            {
                processedVideo.HlsManifestPath = await GenerateHlsManifestAsync(inputPath, videoId, ffmpegPath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate HLS manifest for video {VideoId}", videoId);
            }
        }

        // Generate DASH manifest if enabled
        if (enableDash)
        {
            try
            {
                processedVideo.DashManifestPath = await GenerateDashManifestAsync(inputPath, videoId, ffmpegPath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate DASH manifest for video {VideoId}", videoId);
            }
        }

        return processedVideo;
    }

    public async Task<string> GenerateHlsManifestAsync(string videoPath, Guid videoId, string ffmpegPath)
    {
        var outputDir = Path.Combine(
            _environment.ContentRootPath,
            "wwwroot",
            "processed",
            videoId.ToString(),
            "hls"
        );
        Directory.CreateDirectory(outputDir);

        var manifestPath = Path.Combine(outputDir, "manifest.m3u8");
        var segmentPattern = Path.Combine(outputDir, "segment_%03d.ts");

        // FFmpeg command to generate HLS
        var args = $"-i \"{videoPath}\" " +
                  $"-c:v libx264 -c:a aac " +
                  $"-hls_time 10 -hls_list_size 0 " +
                  $"-hls_segment_filename \"{segmentPattern}\" " +
                  $"\"{manifestPath}\" -y";

        var processStartInfo = new System.Diagnostics.ProcessStartInfo
        {
            FileName = ffmpegPath,
            Arguments = args,
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

        if (process.ExitCode != 0)
        {
            var error = await process.StandardError.ReadToEndAsync();
            _logger.LogError("FFmpeg HLS error: {Error}", error);
            throw new InvalidOperationException($"FFmpeg HLS processing failed: {error}");
        }

        // Return relative path
        return Path.Combine("processed", videoId.ToString(), "hls", "manifest.m3u8").Replace('\\', '/');
    }

    public async Task<string> GenerateDashManifestAsync(string videoPath, Guid videoId, string ffmpegPath)
    {
        var outputDir = Path.Combine(
            _environment.ContentRootPath,
            "wwwroot",
            "processed",
            videoId.ToString(),
            "dash"
        );
        Directory.CreateDirectory(outputDir);

        var manifestPath = Path.Combine(outputDir, "manifest.mpd");
        var segmentPattern = Path.Combine(outputDir, "segment_%03d.m4s");

        // FFmpeg command to generate DASH
        var args = $"-i \"{videoPath}\" " +
                  $"-c:v libx264 -c:a aac " +
                  $"-f dash -seg_duration 10 -use_timeline 1 -use_template 1 " +
                  $"-init_seg_name \"init_$RepresentationID$.m4s\" " +
                  $"-media_seg_name \"{segmentPattern}\" " +
                  $"\"{manifestPath}\" -y";

        var processStartInfo = new System.Diagnostics.ProcessStartInfo
        {
            FileName = ffmpegPath,
            Arguments = args,
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

        if (process.ExitCode != 0)
        {
            var error = await process.StandardError.ReadToEndAsync();
            _logger.LogError("FFmpeg DASH error: {Error}", error);
            throw new InvalidOperationException($"FFmpeg DASH processing failed: {error}");
        }

        // Return relative path
        return Path.Combine("processed", videoId.ToString(), "dash", "manifest.mpd").Replace('\\', '/');
    }

    public async Task<int?> GetVideoDurationAsync(string videoPath, string ffmpegPath)
    {
        try
        {
            // FFmpeg command to get video duration
            var args = $"-i \"{videoPath}\" 2>&1 | findstr /R \"Duration\"";

            var processStartInfo = new System.Diagnostics.ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/c {ffmpegPath} -i \"{videoPath}\" 2>&1",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            };

            using var process = System.Diagnostics.Process.Start(processStartInfo);
            if (process == null)
            {
                return null;
            }

            var output = await process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();

            // Parse duration from output (format: Duration: HH:MM:SS.mm)
            var durationMatch = System.Text.RegularExpressions.Regex.Match(
                output,
                @"Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d{2})"
            );

            if (durationMatch.Success)
            {
                var hours = int.Parse(durationMatch.Groups[1].Value);
                var minutes = int.Parse(durationMatch.Groups[2].Value);
                var seconds = int.Parse(durationMatch.Groups[3].Value);
                return hours * 3600 + minutes * 60 + seconds;
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting video duration");
            return null;
        }
    }
}

public class ProcessedVideo
{
    public string OriginalPath { get; set; } = string.Empty;
    public string OutputDirectory { get; set; } = string.Empty;
    public string? HlsManifestPath { get; set; }
    public string? DashManifestPath { get; set; }
}
