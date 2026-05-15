using LuxWashBackend.Business.Interfaces;
using LuxWashBackend.Data;
using LuxWashBackend.Domain.Constants;
using LuxWashBackend.Domain.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LuxWashBackend.Business.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardStatsDto> GetAdminStatsAsync(AdminDashboardStatsQueryDto query)
        {
            var bookingsQuery = _context.Bookings
                .AsNoTracking()
                .AsQueryable();

            if (query.FromDate.HasValue)
                bookingsQuery = bookingsQuery.Where(b => b.BookingDate >= query.FromDate.Value);

            if (query.ToDate.HasValue)
            {
                var toDate = query.ToDate.Value;
                if (toDate.TimeOfDay == TimeSpan.Zero)
                    toDate = toDate.Date.AddDays(1).AddTicks(-1);

                bookingsQuery = bookingsQuery.Where(b => b.BookingDate <= toDate);
            }

            var totalBookings = await bookingsQuery.CountAsync();
            var pendingBookings = await bookingsQuery.CountAsync(b => b.Status == BookingStatuses.Pending);
            var completedBookings = await bookingsQuery.CountAsync(b => b.Status == BookingStatuses.Completed);
            var cancelledBookings = await bookingsQuery.CountAsync(b => b.Status == BookingStatuses.Cancelled);

            var estimatedRevenue = await (
                from booking in bookingsQuery
                join service in _context.Services.AsNoTracking() on booking.ServiceId equals service.Id
                where booking.Status != BookingStatuses.Cancelled
                select (decimal?)service.Price
            ).SumAsync() ?? 0m;

            return new AdminDashboardStatsDto
            {
                Users = new AdminDashboardUsersStatsDto
                {
                    Total = await _context.Users.AsNoTracking().CountAsync()
                },
                Bookings = new AdminDashboardBookingsStatsDto
                {
                    Total = totalBookings,
                    Pending = pendingBookings,
                    Completed = completedBookings,
                    Cancelled = cancelledBookings,
                    EstimatedRevenue = estimatedRevenue
                },
                Catalog = new AdminDashboardCatalogStatsDto
                {
                    TotalProducts = await _context.Products.AsNoTracking().CountAsync(),
                    ActiveServices = await _context.Services.AsNoTracking().CountAsync(s => s.IsActive)
                }
            };
        }
    }
}
