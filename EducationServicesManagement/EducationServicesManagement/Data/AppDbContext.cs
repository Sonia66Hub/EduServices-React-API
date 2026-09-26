using EducationServicesManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace EducationServicesManagement.Data
{
    
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        
        public DbSet<Department> Departments { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<Department>().HasData(
                new Department { DepartmentId = 1, DepartmentName = "Computer Science" },
                new Department { DepartmentId = 2, DepartmentName = "Mathematics" },
                new Department { DepartmentId = 3, DepartmentName = "Physics" }
            );

            
            modelBuilder.Entity<Teacher>().HasData(
                new Teacher { TeacherId = 1, Name = "John Doe", DepartmentId = 1, Picture = "noimage.png" },
                new Teacher { TeacherId = 2, Name = "Jane Smith", DepartmentId = 2, Picture = "noimage.png" }
            );

            
            modelBuilder.Entity<Course>().HasData(
                new Course { CourseId = 1, CourseName = "BSc Computer Science" },
                new Course { CourseId = 2, CourseName = "BSc Mathematics" }
            );

            
            modelBuilder.Entity<Subject>().HasData(
                new Subject { SubjectId = 1, SubjectName = "Data Structures", CourseId = 1 },
                new Subject { SubjectId = 2, SubjectName = "Algorithms", CourseId = 1 },
                new Subject { SubjectId = 3, SubjectName = "Calculus", CourseId = 2 }
            );

            
            modelBuilder.Entity<Student>().HasData(
                new Student
                {
                    StudentId = 1,
                    FullName = "Alice Johnson",
                    Email = "alice@example.com",
                    DateOfBirth = new DateTime(2000, 1, 15),
                    Picture = "noimage.png"
                },
                new Student
                {
                    StudentId = 2,
                    FullName = "Bob Williams",
                    Email = "bob@example.com",
                    DateOfBirth = new DateTime(1999, 5, 30),
                    Picture = "noimage.png"
                }
            );

           
            modelBuilder.Entity<Enrollment>().HasData(
                new Enrollment { EnrollmentId = 1, StudentId = 1, CourseId = 1, EnrollmentDate = new DateTime(2023, 9, 1) },
                new Enrollment { EnrollmentId = 2, StudentId = 2, CourseId = 2, EnrollmentDate = new DateTime(2023, 9, 1) }
            );

           
            modelBuilder.Entity<Attendance>().HasData(
                new Attendance { AttendanceId = 1, StudentId = 1, CourseId = 1, AttendanceDate = new DateTime(2025, 7, 15), IsPresent = true },
                new Attendance { AttendanceId = 2, StudentId = 2, CourseId = 2, AttendanceDate = new DateTime(2025, 7, 15), IsPresent = false }
            );
        }
    }
}