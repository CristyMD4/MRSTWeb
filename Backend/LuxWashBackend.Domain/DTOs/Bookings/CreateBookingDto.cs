using System.ComponentModel.DataAnnotations;

namespace LuxWashBackend.Domain.DTOs
{
    public class CreateBookingDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int ServiceId { get; set; }

        [Required]
        public DateTime BookingDate { get; set; }
    }
}
