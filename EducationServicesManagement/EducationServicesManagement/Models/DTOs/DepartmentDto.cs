using System.ComponentModel.DataAnnotations;

namespace EducationServicesManagement.Models.DTOs
{

    public class UserRegistrationDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Required]
        public string Role { get; set; }
    }


    public class UserLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class AuthResponseDto
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool IsAuthSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public class DepartmentDto
    {
        public int DepartmentId { get; set; }

        [Required, StringLength(100)]
        public string DepartmentName { get; set; }
    }

    public class TeacherDto
    {
        public int? TeacherId { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; }

        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }

        public string Picture { get; set; } = "noimage.png";

        public IFormFile? PictureFile { get; set; }
    }

    public class CourseDto
    {
        public int CourseId { get; set; }

        [Required, StringLength(100)]
        public string CourseName { get; set; }
    }

    public class SubjectDto
    {
        public int? SubjectId { get; set; }

        [Required, StringLength(100)]
        public string SubjectName { get; set; }

        public int CourseId { get; set; }
        public string? CourseName { get; set; }
    }

    public class StudentCreateUpdateDto
    {
        public int? StudentId { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }


        public DateTime? DateOfBirth { get; set; }


        public IFormFile? PictureFile { get; set; }
    }

    public class StudentReadDto
    {
        public int StudentId { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string Picture { get; set; }

        public List<EnrollmentDto> Enrollments { get; set; } = new();

        public List<AttendanceDto> Attendances { get; set; } = new();
    }

    public class EnrollmentDto
    {
        public int? EnrollmentId { get; set; }

        public int StudentId { get; set; }
        public string? StudentName { get; set; }

        public int CourseId { get; set; }
        public string? CourseName { get; set; }

        public DateTime EnrollmentDate { get; set; }
    }

    public class AttendanceDto
    {
        public int? AttendanceId { get; set; }

        public int StudentId { get; set; }
        public string? StudentName { get; set; }

        public int CourseId { get; set; }
        public string? CourseName { get; set; }

        public DateTime AttendanceDate { get; set; }

        public bool IsPresent { get; set; }
    }
}
