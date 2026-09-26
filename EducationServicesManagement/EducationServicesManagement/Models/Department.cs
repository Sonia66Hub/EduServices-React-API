using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace EducationServicesManagement.Models
{
    
    public class User : IdentityUser
    {
        

        [Required]
        [StringLength(50)]
        public string Role { get; set; } 

        [NotMapped]
        public string ConfirmPassword { get; set; } 

       
        public int? StudentId { get; set; }
        public Student? Student { get; set; }

        public int? TeacherId { get; set; }
        public Teacher? Teacher { get; set; }
    }

    public class Department
    {
        [Key]
        public int DepartmentId { get; set; }

        [Required, StringLength(100)]
        public string DepartmentName { get; set; }

        public ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
    }

    public class Teacher
    {
        [Key]
        public int TeacherId { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; }

        public int? DepartmentId { get; set; }
        public Department? Department { get; set; }

        public string Picture { get; set; } = "noimage.png";

        [NotMapped]
        public IFormFile? PictureFile { get; set; }
    }

    public class Course
    {
        [Key]
        public int CourseId { get; set; }

        [Required, StringLength(100)]
        public string CourseName { get; set; }

        public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    }

    public class Subject
    {
        [Key]
        public int SubjectId { get; set; }

        [Required, StringLength(100)]
        public string SubjectName { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }
    }

    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        [Required, StringLength(100)]
        public string FullName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string Picture { get; set; } = "noimage.png";

        [NotMapped]
        public IFormFile? PictureFile { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    }

    public class Enrollment
    {
        [Key]
        public int EnrollmentId { get; set; }

        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }

        public DateTime EnrollmentDate { get; set; }
    }

    public class Attendance
    {
        [Key]
        public int AttendanceId { get; set; }

        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }

        public DateTime AttendanceDate { get; set; }

        public bool IsPresent { get; set; }
    }
}