namespace LuxWashBackend.Domain.DTOs
{
    public class ContactMessageResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Message { get; set; } = "";
        public DateTime CreatedAt { get; set; }
    }
}