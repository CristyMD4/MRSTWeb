using LuxWashBackend.Domain.DTOs;

namespace LuxWashBackend.Business.Interfaces
{
    public interface IContactService
    {
        Task<ContactMessageResponseDto> CreateAsync(CreateContactMessageDto dto);
        Task<List<ContactMessageResponseDto>> GetAllAsync();
    }
}