using LuxWashBackend.Business.Interfaces;
using LuxWashBackend.Domain.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LuxWashBackend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ServiceQueryDto query)
        {
            var services = await _serviceService.GetAllServicesAsync(query);
            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);

            if (service == null)
                return NotFound("Service not found.");

            return Ok(service);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateServiceDto dto)
        {
            var createdService = await _serviceService.CreateServiceAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdService.Id }, createdService);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateServiceDto dto)
        {
            var updatedService = await _serviceService.UpdateServiceAsync(id, dto);

            if (updatedService == null)
                return NotFound("Service not found.");

            return Ok(updatedService);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _serviceService.DeleteServiceAsync(id);

            if (!deleted)
                return NotFound("Service not found.");

            return NoContent();
        }
    }
}