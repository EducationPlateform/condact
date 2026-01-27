using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using EducationPlatform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationPlatform.API.Services;

public interface IDrmService
{
    Task<string> GenerateLicenseTokenAsync(Guid videoId, Guid userId);
    Task<DrmConfig> GetDrmConfigurationAsync(Guid videoId);
    Task<bool> ValidateLicenseTokenAsync(string token, Guid videoId, Guid userId);
}

public class DrmService : IDrmService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DrmService> _logger;

    public DrmService(
        ApplicationDbContext context,
        IConfiguration configuration,
        ILogger<DrmService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string> GenerateLicenseTokenAsync(Guid videoId, Guid userId)
    {
        var video = await _context.Videos.FindAsync(videoId);
        if (video == null)
        {
            throw new InvalidOperationException("Video not found");
        }

        var tokenData = new
        {
            videoId = videoId.ToString(),
            userId = userId.ToString(),
            issuedAt = DateTime.UtcNow,
            expiresAt = DateTime.UtcNow.AddHours(24) // Token valid for 24 hours
        };

        var json = JsonSerializer.Serialize(tokenData);
        var secretKey = _configuration["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        
        // Create a simple token (in production, use proper JWT or signed token)
        var tokenBytes = Encoding.UTF8.GetBytes(json);
        var keyBytes = Encoding.UTF8.GetBytes(secretKey);
        
        using var hmac = new HMACSHA256(keyBytes);
        var hash = hmac.ComputeHash(tokenBytes);
        var signature = Convert.ToBase64String(hash);
        
        var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(json)) + "." + signature;
        return token;
    }

    public async Task<DrmConfig> GetDrmConfigurationAsync(Guid videoId)
    {
        var video = await _context.Videos
            .FirstOrDefaultAsync(v => v.Id == videoId);

        if (video == null)
        {
            throw new InvalidOperationException("Video not found");
        }

        var securityConfigJson = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(video.SecurityConfig);
        var drmEnabled = securityConfigJson != null && 
                        securityConfigJson.ContainsKey("drmEnabled") && 
                        securityConfigJson["drmEnabled"].GetBoolean();
        
        var widevineLicenseServer = _configuration["DrmSettings:WidevineLicenseServer"];
        var fairPlayLicenseServer = _configuration["DrmSettings:FairPlayLicenseServer"];
        var certificateUrl = _configuration["DrmSettings:CertificateUrl"];

        return new DrmConfig
        {
            VideoId = videoId.ToString(),
            DrmEnabled = drmEnabled,
            WidevineLicenseServer = widevineLicenseServer,
            FairPlayLicenseServer = fairPlayLicenseServer,
            CertificateUrl = certificateUrl,
            ManifestUrl = $"/api/videos/{videoId}/manifest.m3u8", // HLS manifest
            DashManifestUrl = $"/api/videos/{videoId}/manifest.mpd" // DASH manifest
        };
    }

    public async Task<bool> ValidateLicenseTokenAsync(string token, Guid videoId, Guid userId)
    {
        try
        {
            var parts = token.Split('.');
            if (parts.Length != 2)
            {
                return false;
            }

            var jsonBytes = Convert.FromBase64String(parts[0]);
            var json = Encoding.UTF8.GetString(jsonBytes);
            var tokenData = JsonSerializer.Deserialize<LicenseTokenData>(json);

            if (tokenData == null)
            {
                return false;
            }

            // Validate token data
            if (tokenData.VideoId != videoId.ToString() || tokenData.UserId != userId.ToString())
            {
                return false;
            }

            if (tokenData.ExpiresAt < DateTime.UtcNow)
            {
                return false;
            }

            // Validate signature
            var secretKey = _configuration["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            
            using var hmac = new HMACSHA256(keyBytes);
            var hash = hmac.ComputeHash(jsonBytes);
            var expectedSignature = Convert.ToBase64String(hash);

            return parts[1] == expectedSignature;
        }
        catch
        {
            return false;
        }
    }
}

public class DrmConfig
{
    public string VideoId { get; set; } = string.Empty;
    public bool DrmEnabled { get; set; }
    public string? WidevineLicenseServer { get; set; }
    public string? FairPlayLicenseServer { get; set; }
    public string? CertificateUrl { get; set; }
    public string ManifestUrl { get; set; } = string.Empty;
    public string DashManifestUrl { get; set; } = string.Empty;
}

public class LicenseTokenData
{
    public string VideoId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}
