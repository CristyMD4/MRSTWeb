# LuxWash Backend

## Local setup

Set a local JWT signing key before running the API:

```powershell
dotnet user-secrets set "Jwt:Key" "replace-with-a-strong-32-character-or-longer-key" --project LuxWashBackend.Api
```

Apply database migrations:

```powershell
dotnet tool restore
dotnet tool run dotnet-ef database update --project LuxWashBackend.Data --startup-project LuxWashBackend.Api
```

Build the solution:

```powershell
dotnet build LuxWashBackend.Api/LuxWashBackend.Api.slnx
```
