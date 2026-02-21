using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using EducationPlatform.Infrastructure.Data;
using EducationPlatform.API.Services;
using EducationPlatform.API.Middleware;
using EducationPlatform.API.Swagger;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure dynamic port for Render
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://*:{port}");

// Increase multipart body size limit for video uploads (e.g., 500MB)
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 524288000; // 500 MB
});

// Configure Swagger with JWT support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Education Platform API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
    c.OperationFilter<FileUploadOperationFilter>();
});

// Configure Database
var connectionString = Environment.GetEnvironmentVariable("DefaultConnection")
                       ?? builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(ConvertUrlConnectionString(connectionString)));

// Configure JWT Authentication
var secretKey = Environment.GetEnvironmentVariable("JwtSettings_SecretKey")
                ?? Environment.GetEnvironmentVariable("JwtSettings__SecretKey")
                ?? builder.Configuration.GetSection("JwtSettings")["SecretKey"]
                ?? throw new InvalidOperationException("JWT SecretKey not configured");

var jwtSettings = builder.Configuration.GetSection("JwtSettings");

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ValidateIssuer = true,
            ValidIssuer = Environment.GetEnvironmentVariable("JwtSettings_Issuer")
                          ?? Environment.GetEnvironmentVariable("JwtSettings__Issuer")
                          ?? jwtSettings["Issuer"]
                          ?? "EducationPlatform",
            ValidateAudience = true,
            ValidAudience = Environment.GetEnvironmentVariable("JwtSettings_Audience")
                            ?? Environment.GetEnvironmentVariable("JwtSettings__Audience")
                            ?? jwtSettings["Audience"]
                            ?? "EducationPlatform",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

// Configure CORS
var allowedOrigins = Environment.GetEnvironmentVariable("Cors_AllowedOrigins")
                         ?.Split(',', StringSplitOptions.RemoveEmptyEntries)
                     ?? Environment.GetEnvironmentVariable("Cors__AllowedOrigins")
                         ?.Split(',', StringSplitOptions.RemoveEmptyEntries)
                     ?? builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                     ?? new[] { "http://localhost:5173", "http://localhost:3000" };

allowedOrigins = allowedOrigins
    .Select(o => o.Trim().TrimEnd('/'))
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Register services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<IAccessControlService, AccessControlService>();
builder.Services.AddScoped<IScoringService, ScoringService>();
builder.Services.AddScoped<ISecurityViolationService, SecurityViolationService>();
builder.Services.AddScoped<IWatermarkService, WatermarkService>();
builder.Services.AddScoped<IDrmService, DrmService>();
builder.Services.AddScoped<IVideoProcessingService, VideoProcessingService>();

var app = builder.Build();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await DbInitializer.InitializeAsync(context);
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Add error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

app.MapControllers();
app.MapGet("/", () => "Education Platform API is running!");

app.Run();

static string ConvertUrlConnectionString(string url)
{
    if (string.IsNullOrWhiteSpace(url) || !url.StartsWith("postgres://"))
        return url;

    var uri = new Uri(url);
    var userInfo = uri.UserInfo.Split(':');

    return
        $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SslMode=Require;TrustServerCertificate=true";
}
