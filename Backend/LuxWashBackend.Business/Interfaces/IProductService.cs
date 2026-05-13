using LuxWashBackend.Domain.DTOs;

namespace LuxWashBackend.Business.Interfaces
{
    public interface IProductService
    {
        Task<PagedResultDto<ProductResponseDto>> GetAllAsync(ProductQueryDto query);
        Task<ProductResponseDto?> GetByIdAsync(int id);
        Task<ProductResponseDto> CreateAsync(CreateProductDto dto);
        Task<ProductResponseDto?> UpdateAsync(int id, UpdateProductDto dto);
        Task<bool> DeleteAsync(int id);
    }
}