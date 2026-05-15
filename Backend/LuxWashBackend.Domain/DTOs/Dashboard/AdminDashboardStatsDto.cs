namespace LuxWashBackend.Domain.DTOs
{
    public class AdminDashboardStatsDto
    {
        public AdminDashboardUsersStatsDto Users { get; set; } = new();
        public AdminDashboardBookingsStatsDto Bookings { get; set; } = new();
        public AdminDashboardCatalogStatsDto Catalog { get; set; } = new();
    }
}
