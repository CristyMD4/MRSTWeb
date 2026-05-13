namespace LuxWashBackend.Domain.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ServiceId { get; set; }
        public DateTime BookingDate { get; set; }
        public string Status { get; set; } = "Pending";

        public User? User { get; set; }
        public Service? Service { get; set; }
    }
}