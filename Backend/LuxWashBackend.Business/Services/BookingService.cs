using LuxWashBackend.Business.Interfaces;
using LuxWashBackend.Data;
using LuxWashBackend.Domain.Constants;
using LuxWashBackend.Domain.DTOs;
using LuxWashBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LuxWashBackend.Business.Services
{
    public class BookingService : IBookingService
    {
        private readonly AppDbContext _context;

        public BookingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<BookingResponseDto> CreateAsync(int userId, CreateBookingDto dto)
        {
            if (dto.BookingDate <= DateTime.UtcNow)
                throw new InvalidOperationException("Booking date must be in the future.");

            var service = await _context.Services
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == dto.ServiceId);

            if (service == null)
                throw new InvalidOperationException("Service not found.");

            if (!service.IsActive)
                throw new InvalidOperationException("Service is not active.");

            var slotAlreadyBooked = await _context.Bookings.AnyAsync(b =>
                b.ServiceId == dto.ServiceId &&
                b.BookingDate == dto.BookingDate &&
                b.Status != BookingStatuses.Cancelled);

            if (slotAlreadyBooked)
                throw new InvalidOperationException("This time slot is already booked.");

            var booking = new Booking
            {
                UserId = userId,
                ServiceId = dto.ServiceId,
                BookingDate = dto.BookingDate,
                Status = BookingStatuses.Pending
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            var createdBooking = await _context.Bookings
                .AsNoTracking()
                .Include(b => b.User)
                .Include(b => b.Service)
                .FirstAsync(b => b.Id == booking.Id);

            return MapToDto(createdBooking);
        }

        public async Task<PagedResultDto<BookingResponseDto>> GetAllAsync(BookingQueryDto query)
        {
            var bookingsQuery = _context.Bookings
                .AsNoTracking()
                .Include(b => b.User)
                .Include(b => b.Service)
                .AsQueryable();

            bookingsQuery = ApplyFilters(bookingsQuery, query, allowUserFilter: true);

            return await BuildPagedResultAsync(bookingsQuery, query);
        }

        public async Task<PagedResultDto<BookingResponseDto>> GetByUserIdAsync(int userId, BookingQueryDto query)
        {
            var bookingsQuery = _context.Bookings
                .AsNoTracking()
                .Include(b => b.User)
                .Include(b => b.Service)
                .Where(b => b.UserId == userId)
                .AsQueryable();

            bookingsQuery = ApplyFilters(bookingsQuery, query, allowUserFilter: false);

            return await BuildPagedResultAsync(bookingsQuery, query);
        }

        private static IQueryable<Booking> ApplyFilters(
            IQueryable<Booking> bookingsQuery,
            BookingQueryDto query,
            bool allowUserFilter)
        {
            if (!string.IsNullOrWhiteSpace(query.Status))
            {
                var status = BookingStatuses.Normalize(query.Status);
                if (status == null)
                    throw new InvalidOperationException("Invalid booking status.");

                bookingsQuery = bookingsQuery.Where(b => b.Status == status);
            }

            if (query.ServiceId.HasValue)
                bookingsQuery = bookingsQuery.Where(b => b.ServiceId == query.ServiceId.Value);

            if (allowUserFilter && query.UserId.HasValue)
                bookingsQuery = bookingsQuery.Where(b => b.UserId == query.UserId.Value);

            if (query.FromDate.HasValue)
                bookingsQuery = bookingsQuery.Where(b => b.BookingDate >= query.FromDate.Value);

            if (query.ToDate.HasValue)
                bookingsQuery = bookingsQuery.Where(b => b.BookingDate <= query.ToDate.Value);

            return bookingsQuery.OrderByDescending(b => b.BookingDate);
        }

        private static async Task<PagedResultDto<BookingResponseDto>> BuildPagedResultAsync(
            IQueryable<Booking> bookingsQuery,
            BookingQueryDto query)
        {
            var totalCount = await bookingsQuery.CountAsync();

            var items = await bookingsQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return new PagedResultDto<BookingResponseDto>
            {
                Items = items.Select(MapToDto).ToList(),
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize)
            };
        }

        private static BookingResponseDto MapToDto(Booking booking)
        {
            return new BookingResponseDto
            {
                Id = booking.Id,
                UserId = booking.UserId,
                ServiceId = booking.ServiceId,
                BookingDate = booking.BookingDate,
                Status = booking.Status,
                User = booking.User == null ? null : new BookingUserDto
                {
                    Id = booking.User.Id,
                    FullName = booking.User.FullName,
                    Email = booking.User.Email,
                    Role = booking.User.Role,
                    CreatedAt = booking.User.CreatedAt
                },
                Service = booking.Service == null ? null : new BookingServiceDto
                {
                    Id = booking.Service.Id,
                    Title = booking.Service.Title,
                    Description = booking.Service.Description,
                    Price = booking.Service.Price,
                    DurationMinutes = booking.Service.DurationMinutes,
                    IsActive = booking.Service.IsActive
                }
            };
        }
    }
}
