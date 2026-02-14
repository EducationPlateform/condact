# Stage 1: Build the Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy Solution and Project files first for caching
COPY backend/EducationPlatform.sln ./
COPY backend/EducationPlatform.API/*.csproj ./backend/EducationPlatform.API/
COPY backend/EducationPlatform.Domain/*.csproj ./backend/EducationPlatform.Domain/
COPY backend/EducationPlatform.Infrastructure/*.csproj ./backend/EducationPlatform.Infrastructure/

# Restore dependencies
RUN dotnet restore backend/EducationPlatform.sln

# Copy the rest of the source code
COPY backend/ ./backend/

# Publish the API
WORKDIR /src/backend/EducationPlatform.API
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 8080
# ASPNETCORE_URLS will be set dynamically or we listen on PORT env var


# Copy artifacts from build stage
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "EducationPlatform.API.dll"]
