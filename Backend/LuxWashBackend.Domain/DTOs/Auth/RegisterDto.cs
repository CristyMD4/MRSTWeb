using System.ComponentModel.DataAnnotations;

namespace LuxWashBackend.Domain.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(120, MinimumLength = 2)]
        public string FullName { get; set; } = "";

        [Required]
        [EmailAddress]
        [StringLength(254)]
        public string Email { get; set; } = "";

        [Required]
        [MinLength(8)]
        [StringLength(128)]
        public string Password { get; set; } = "";
    }
}
