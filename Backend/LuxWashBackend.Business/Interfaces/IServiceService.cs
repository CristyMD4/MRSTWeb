using LuxWashBackend.Domain.DTOs;

namespace LuxWashBackend.Business.Interfaces
{
    public interface IServiceService
    {
        Task<PagedResultDto<ServiceResponseDto>> GetAllServicesAsync(ServiceQueryDto query);
        Task<ServiceResponseDto?> GetServiceByIdAsync(int id);
        Task<ServiceResponseDto> CreateServiceAsync(CreateServiceDto dto);
        Task<ServiceResponseDto?> UpdateServiceAsync(int id, UpdateServiceDto dto);
        Task<bool> DeleteServiceAsync(int id);
    }
}