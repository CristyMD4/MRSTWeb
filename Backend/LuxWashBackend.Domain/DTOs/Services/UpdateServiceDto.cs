using System.ComponentModel.DataAnnotations;

namespace LuxWashBackend.Domain.DTOs
{
    public class UpdateServiceDto
    {
        [Required]
        [StringLength(120, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(1000, MinimumLength = 10)]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, 10000)]
        public decimal Price { get; set; }

        [Range(1, 1000)]
        public int DurationMinutes { get; set; }
    }
}
