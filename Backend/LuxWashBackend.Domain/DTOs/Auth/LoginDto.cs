using System.ComponentModel.DataAnnotations;

namespace LuxWashBackend.Domain.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        [StringLength(254)]
        public string Email { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";
    }
}
