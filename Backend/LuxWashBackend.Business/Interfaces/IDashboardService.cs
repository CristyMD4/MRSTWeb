using LuxWashBackend.Domain.DTOs;

namespace LuxWashBackend.Business.Interfaces
{
    public interface IDashboardService
    {
        Task<AdminDashboardStatsDto> GetAdminStatsAsync(AdminDashboardStatsQueryDto query);
    }
}
