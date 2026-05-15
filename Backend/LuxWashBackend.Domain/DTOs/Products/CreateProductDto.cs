using System.ComponentModel.DataAnnotations;

namespace LuxWashBackend.Domain.DTOs
{
    public class CreateProductDto
    {
        [Required]
        [StringLength(120, MinimumLength = 2)]
        public string Name { get; set; } = "";

        [Range(0.01, 10000)]
        public decimal Price { get; set; }
    }
}
