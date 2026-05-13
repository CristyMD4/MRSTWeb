using System.ComponentModel.DataAnnotations;

namespace LuxWashBackend.Domain.DTOs
{
    public class BookingQueryDto
    {
        public string? Status { get; set; }
        public int? ServiceId { get; set; }
        public int? UserId { get; set; }

        [Range(1, int.MaxValue)]
        public int Page { get; set; } = 1;

        [Range(1, 100)]
        public int PageSize { get; set; } = 10;

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}