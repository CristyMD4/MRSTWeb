using System.ComponentModel.DataAnnotations;

namespace LuxWashBackend.Domain.DTOs
{
    public class CreateContactMessageDto
    {
        [Required]
        [StringLength(120, MinimumLength = 2)]
        public string Name { get; set; } = "";

        [Required]
        [EmailAddress]
        [StringLength(254)]
        public string Email { get; set; } = "";

        [Required]
        [StringLength(2000, MinimumLength = 10)]
        public string Message { get; set; } = "";
    }
}
