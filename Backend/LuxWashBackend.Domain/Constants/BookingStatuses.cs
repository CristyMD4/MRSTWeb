namespace LuxWashBackend.Domain.Constants
{
    public static class BookingStatuses
    {
        public const string Pending = "Pending";
        public const string Completed = "Completed";
        public const string Cancelled = "Cancelled";

        public static readonly string[] All =
        [
            Pending,
            Completed,
            Cancelled
        ];

        public static string? Normalize(string? status)
        {
            if (string.IsNullOrWhiteSpace(status))
                return null;

            return All.FirstOrDefault(s =>
                string.Equals(s, status.Trim(), StringComparison.OrdinalIgnoreCase));
        }
    }
}
