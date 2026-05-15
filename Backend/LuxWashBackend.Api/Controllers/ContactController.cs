using LuxWashBackend.Business.Interfaces;
using LuxWashBackend.Domain.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LuxWashBackend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateContactMessageDto dto)
        {
            var message = await _contactService.CreateAsync(dto);
            return Ok(message);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var messages = await _contactService.GetAllAsync();
            return Ok(messages);
        }
    }
}