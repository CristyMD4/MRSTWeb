using LuxWashBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LuxWashBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Service> Services => Set<Service>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
        public DbSet<Product> Products => Set<Product>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Service>()
                .Property(s => s.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.FullName)
                .HasMaxLength(120);

            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .HasMaxLength(254);

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasMaxLength(50);

            modelBuilder.Entity<Booking>()
                .Property(b => b.Status)
                .HasMaxLength(50);

            modelBuilder.Entity<ContactMessage>()
                .Property(c => c.Name)
                .HasMaxLength(120);

            modelBuilder.Entity<ContactMessage>()
                .Property(c => c.Email)
                .HasMaxLength(254);

            modelBuilder.Entity<ContactMessage>()
                .Property(c => c.Message)
                .HasMaxLength(2000);

            modelBuilder.Entity<Product>()
                .Property(p => p.Name)
                .HasMaxLength(120);

            modelBuilder.Entity<Service>()
                .Property(s => s.Title)
                .HasMaxLength(120);

            modelBuilder.Entity<Service>()
                .Property(s => s.Description)
                .HasMaxLength(1000);
        }
    }
}
