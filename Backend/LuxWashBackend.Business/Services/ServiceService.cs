using LuxWashBackend.Business.Interfaces;
using LuxWashBackend.Data;
using LuxWashBackend.Domain.DTOs;
using LuxWashBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LuxWashBackend.Business.Services
{
    public class ServiceService : IServiceService
    {
        private readonly AppDbContext _context;

        public ServiceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<ServiceResponseDto>> GetAllServicesAsync(ServiceQueryDto query)
        {
            var servicesQuery = _context.Services
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim();
                servicesQuery = servicesQuery.Where(s =>
                    EF.Functions.Like(s.Title, $"%{search}%") ||
                    EF.Functions.Like(s.Description, $"%{search}%"));
            }

            if (query.IsActive.HasValue)
                servicesQuery = servicesQuery.Where(s => s.IsActive == query.IsActive.Value);

            if (query.MinPrice.HasValue)
                servicesQuery = servicesQuery.Where(s => s.Price >= query.MinPrice.Value);

            if (query.MaxPrice.HasValue)
                servicesQuery = servicesQuery.Where(s => s.Price <= query.MaxPrice.Value);

            servicesQuery = servicesQuery.OrderBy(s => s.Title);

            var totalCount = await servicesQuery.CountAsync();

            var items = await servicesQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(s => new ServiceResponseDto
                {
                    Id = s.Id,
                    Name = s.Title,
                    Description = s.Description,
                    Price = s.Price,
                    DurationMinutes = s.DurationMinutes
                })
                .ToListAsync();

            return new PagedResultDto<ServiceResponseDto>
            {
                Items = items,
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize)
            };
        }

        public async Task<ServiceResponseDto?> GetServiceByIdAsync(int id)
        {
            return await _context.Services
                .AsNoTracking()
                .Where(s => s.Id == id)
                .Select(s => new ServiceResponseDto
                {
                    Id = s.Id,
                    Name = s.Title,
                    Description = s.Description,
                    Price = s.Price,
                    DurationMinutes = s.DurationMinutes
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ServiceResponseDto> CreateServiceAsync(CreateServiceDto dto)
        {
            var service = new Service
            {
                Title = dto.Name.Trim(),
                Description = dto.Description.Trim(),
                Price = dto.Price,
                DurationMinutes = dto.DurationMinutes
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return MapToDto(service);
        }

        public async Task<ServiceResponseDto?> UpdateServiceAsync(int id, UpdateServiceDto dto)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
                return null;

            service.Title = dto.Name.Trim();
            service.Description = dto.Description.Trim();
            service.Price = dto.Price;
            service.DurationMinutes = dto.DurationMinutes;

            await _context.SaveChangesAsync();

            return MapToDto(service);
        }

        public async Task<bool> DeleteServiceAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
                return false;

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return true;
        }

        private static ServiceResponseDto MapToDto(Service service)
        {
            return new ServiceResponseDto
            {
                Id = service.Id,
                Name = service.Title,
                Description = service.Description,
                Price = service.Price,
                DurationMinutes = service.DurationMinutes
            };
        }
    }
}
