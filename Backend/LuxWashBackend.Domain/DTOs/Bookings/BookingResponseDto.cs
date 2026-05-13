namespace LuxWashBackend.Domain.DTOs
{
    public class BookingResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ServiceId { get; set; }
        public DateTime BookingDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public BookingUserDto? User { get; set; }
        public BookingServiceDto? Service { get; set; }
    }
}