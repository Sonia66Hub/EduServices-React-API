using EducationServicesManagement.Data;
using EducationServicesManagement.Models;
using EducationServicesManagement.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EducationServicesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public StudentsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Students
        [HttpGet]
        [Authorize(Roles = "Admin, Teacher")]
        public async Task<ActionResult<IEnumerable<StudentReadDto>>> GetStudents()
        {
            var students = await _context.Students
                .Include(s => s.Enrollments).ThenInclude(e => e.Course)
                .Include(s => s.Attendances).ThenInclude(a => a.Course)
                .ToListAsync();

            var dtoList = students.Select(s => new StudentReadDto
            {
                StudentId = s.StudentId,
                FullName = s.FullName,
                Email = s.Email,
                DateOfBirth = s.DateOfBirth,
                Picture = GetPictureUrl(s.Picture),
                Enrollments = s.Enrollments.Select(e => new EnrollmentDto
                {
                    EnrollmentId = e.EnrollmentId,
                    StudentId = e.StudentId,
                    CourseId = e.CourseId,
                    CourseName = e.Course.CourseName,
                    EnrollmentDate = e.EnrollmentDate
                }).ToList(),
                Attendances = s.Attendances.Select(a => new AttendanceDto
                {
                    AttendanceId = a.AttendanceId,
                    StudentId = a.StudentId,
                    CourseId = a.CourseId,
                    CourseName = a.Course.CourseName,
                    AttendanceDate = a.AttendanceDate,
                    IsPresent = a.IsPresent
                }).ToList()
            }).ToList();

            return Ok(dtoList);
        }

        // GET: api/Students/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Student")]
        public async Task<ActionResult<StudentReadDto>> GetStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.Enrollments).ThenInclude(e => e.Course)
                .Include(s => s.Attendances).ThenInclude(a => a.Course)
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null) return NotFound();

            if (User.IsInRole("Student") && student.Email != User.Identity.Name)
            {
                return Forbid();
            }

            var dto = new StudentReadDto
            {
                StudentId = student.StudentId,
                FullName = student.FullName,
                Email = student.Email,
                DateOfBirth = student.DateOfBirth,
                Picture = GetPictureUrl(student.Picture),
                Enrollments = student.Enrollments.Select(e => new EnrollmentDto
                {
                    EnrollmentId = e.EnrollmentId,
                    StudentId = e.StudentId,
                    CourseId = e.CourseId,
                    CourseName = e.Course?.CourseName,
                    EnrollmentDate = e.EnrollmentDate
                }).ToList(),
                Attendances = student.Attendances.Select(a => new AttendanceDto
                {
                    AttendanceId = a.AttendanceId,
                    StudentId = a.StudentId,
                    CourseId = a.CourseId,
                    CourseName = a.Course?.CourseName,
                    AttendanceDate = a.AttendanceDate,
                    IsPresent = a.IsPresent
                }).ToList()
            };

            return Ok(dto);
        }

        // POST: api/Students
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StudentReadDto>> PostStudent([FromForm] StudentCreateUpdateDto dto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var student = new Student
            {
                FullName = dto.FullName,
                Email = dto.Email,

                DateOfBirth = dto.DateOfBirth ?? DateTime.MinValue,
                Picture = "noimage.png"
            };

            if (dto.PictureFile != null)
            {
                student.Picture = await SaveImage(dto.PictureFile);
            }

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            var studentReadDto = new StudentReadDto
            {
                StudentId = student.StudentId,
                FullName = student.FullName,
                Email = student.Email,
                DateOfBirth = student.DateOfBirth,
                Picture = GetPictureUrl(student.Picture)
            };

            return CreatedAtAction(nameof(GetStudent), new { id = student.StudentId }, studentReadDto);
        }

        // PUT: api/Students/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Student")]
        public async Task<IActionResult> PutStudent(int id, [FromForm] StudentCreateUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            if (User.IsInRole("Student") && student.Email != User.Identity.Name)
            {
                return Forbid();
            }

            student.FullName = dto.FullName;
            student.Email = dto.Email;

            if (dto.DateOfBirth.HasValue)
            {
                student.DateOfBirth = dto.DateOfBirth.Value;
            }

            if (dto.PictureFile != null)
            {
                if (student.Picture != "noimage.png")
                    DeleteImage(student.Picture);

                student.Picture = await SaveImage(dto.PictureFile);
            }

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            if (student.Picture != "noimage.png")
                DeleteImage(student.Picture);

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentExists(int id) => _context.Students.Any(e => e.StudentId == id);

        [NonAction]
        private async Task<string> SaveImage(IFormFile file)
        {
            string folderPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            string fileName = Path.GetFileNameWithoutExtension(file.FileName)
                .Replace(" ", "_")
                + "_" + Guid.NewGuid() + Path.GetExtension(file.FileName);

            string path = Path.Combine(folderPath, fileName);
            using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);

            return "/uploads/" + fileName;
        }

        [NonAction]
        private void DeleteImage(string path)
        {
            if (string.IsNullOrEmpty(path) || path == "noimage.png") return;
            string file = path.StartsWith("/") ? path.Substring(1) : path;
            var fullPath = Path.Combine(_env.WebRootPath, file);
            if (System.IO.File.Exists(fullPath)) System.IO.File.Delete(fullPath);
        }

        [NonAction]
        private string GetPictureUrl(string path)
        {
            if (string.IsNullOrEmpty(path) || path == "noimage.png") return null;
            return $"{Request.Scheme}://{Request.Host}/uploads/{Path.GetFileName(path)}";
        }
    }
}