using LuxWashBackend.Domain.DTOs;

namespace LuxWashBackend.Business.Interfaces
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateAsync(int userId, CreateBookingDto dto);
        Task<PagedResultDto<BookingResponseDto>> GetAllAsync(BookingQueryDto query);
        Task<PagedResultDto<BookingResponseDto>> GetByUserIdAsync(int userId, BookingQueryDto query);
    }
}