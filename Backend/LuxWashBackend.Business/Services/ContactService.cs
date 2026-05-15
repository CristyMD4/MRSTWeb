using LuxWashBackend.Business.Interfaces;
using LuxWashBackend.Data;
using LuxWashBackend.Domain.DTOs;
using LuxWashBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LuxWashBackend.Business.Services
{
    public class ContactService : IContactService
    {
        private readonly AppDbContext _context;

        public ContactService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ContactMessageResponseDto> CreateAsync(CreateContactMessageDto dto)
        {
            var contact = new ContactMessage
            {
                Name = dto.Name.Trim(),
                Email = dto.Email.Trim().ToLowerInvariant(),
                Message = dto.Message.Trim()
            };

            _context.ContactMessages.Add(contact);
            await _context.SaveChangesAsync();

            return MapToDto(contact);
        }

        public async Task<List<ContactMessageResponseDto>> GetAllAsync()
        {
            var messages = await _context.ContactMessages
                .AsNoTracking()
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return messages.Select(MapToDto).ToList();
        }

        private static ContactMessageResponseDto MapToDto(ContactMessage contact)
        {
            return new ContactMessageResponseDto
            {
                Id = contact.Id,
                Name = contact.Name,
                Email = contact.Email,
                Message = contact.Message,
                CreatedAt = contact.CreatedAt
            };
        }
    }
}
