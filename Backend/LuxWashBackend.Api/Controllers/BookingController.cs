using System.Security.Claims;
using LuxWashBackend.Business.Interfaces;
using LuxWashBackend.Domain.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LuxWashBackend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token.");

            try
            {
                var booking = await _bookingService.CreateAsync(userId, dto);
                return Ok(booking);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] BookingQueryDto query)
        {
            try
            {
                var bookings = await _bookingService.GetAllAsync(query);
                return Ok(bookings);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyBookings([FromQuery] BookingQueryDto query)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token.");

            try
            {
                var bookings = await _bookingService.GetByUserIdAsync(userId, query);
                return Ok(bookings);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId, [FromQuery] BookingQueryDto query)
        {
            query.UserId = userId;

            try
            {
                var bookings = await _bookingService.GetAllAsync(query);
                return Ok(bookings);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
