namespace LuxWashBackend.Domain.DTOs
{
    public class AdminDashboardBookingsStatsDto
    {
        public int Total { get; set; }
        public int Pending { get; set; }
        public int Completed { get; set; }
        public int Cancelled { get; set; }
        public decimal EstimatedRevenue { get; set; }
    }
}
