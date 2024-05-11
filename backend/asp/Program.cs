using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<DeploymentWorkshopContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DeploymentWorkshop")));
var app = builder.Build();
app.UseHttpsRedirection();
app.MapGet("/api/cars", (DeploymentWorkshopContext context) => context.Cars.ToList());
app.Run();

internal class DeploymentWorkshopContext(DbContextOptions<DeploymentWorkshopContext> options) : DbContext(options)
{
    public DbSet<Car>? Cars { get; init; }
}

[Table("car")]
internal class Car
{
    [Column("id")]
    public int Id { get; init; }
    [Column("manufacturer")]
    public string? Manufacturer { get; init; }
    [Column("model")]
    public string? Model { get; init; }
}