using EducationServicesManagement.Data;
using EducationServicesManagement.Models.DTOs;
using EducationServicesManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; 

namespace EducationServicesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class EnrollmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EnrollmentsController(AppDbContext context) => _context = context;

       
        [HttpGet]
        [Authorize(Roles = "Admin, Teacher")] 
        public async Task<ActionResult<IEnumerable<EnrollmentDto>>> Get()
        {
            var enrollments = await _context.Enrollments
                .Include(e => e.Course)
                .Include(e => e.Student)
                .Select(e => new EnrollmentDto
                {
                    EnrollmentId = e.EnrollmentId,
                    StudentId = e.StudentId,
                    StudentName = e.Student.FullName,
                    CourseId = e.CourseId,
                    CourseName = e.Course.CourseName,
                    EnrollmentDate = e.EnrollmentDate
                })
                .ToListAsync();

            return Ok(enrollments);
        }

       
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Teacher, Student")] 
        public async Task<ActionResult<EnrollmentDto>> Get(int id)
        {
            var enrollment = await _context.Enrollments
                .Include(e => e.Course)
                .Include(e => e.Student)
                .FirstOrDefaultAsync(e => e.EnrollmentId == id);

            if (enrollment == null)
            {
                return NotFound();
            }

            
            if (User.IsInRole("Student") && enrollment.Student.Email != User.Identity.Name)
            {
                return Forbid();
            }

            var dto = new EnrollmentDto
            {
                EnrollmentId = enrollment.EnrollmentId,
                StudentId = enrollment.StudentId,
                StudentName = enrollment.Student.FullName,
                CourseId = enrollment.CourseId,
                CourseName = enrollment.Course.CourseName,
                EnrollmentDate = enrollment.EnrollmentDate
            };
            return Ok(dto);
        }

        
        [HttpPost]
        [Authorize(Roles = "Admin, Teacher")] 
        public async Task<ActionResult<EnrollmentDto>> Post([FromBody] EnrollmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!await _context.Students.AnyAsync(s => s.StudentId == dto.StudentId))
            {
                return BadRequest($"Invalid StudentId: {dto.StudentId}");
            }
            if (!await _context.Courses.AnyAsync(c => c.CourseId == dto.CourseId))
            {
                return BadRequest($"Invalid CourseId: {dto.CourseId}");
            }

            var enrollment = new Enrollment
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                EnrollmentDate = DateTime.Now 
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

           
            var createdDto = new EnrollmentDto
            {
                EnrollmentId = enrollment.EnrollmentId,
                StudentId = enrollment.StudentId,
                StudentName = _context.Students.Find(enrollment.StudentId)?.FullName, 
                CourseId = enrollment.CourseId,
                CourseName = _context.Courses.Find(enrollment.CourseId)?.CourseName, 
                EnrollmentDate = enrollment.EnrollmentDate
            };

            return CreatedAtAction(nameof(Get), new { id = enrollment.EnrollmentId }, createdDto);
        }

       
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Teacher")]
        public async Task<IActionResult> Put(int id, [FromBody] EnrollmentDto dto)
        {
            if (id != dto.EnrollmentId)
            {
                return BadRequest();
            }

            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null)
            {
                return NotFound();
            }

            if (!await _context.Students.AnyAsync(s => s.StudentId == dto.StudentId))
            {
                return BadRequest($"Invalid StudentId: {dto.StudentId}");
            }
            if (!await _context.Courses.AnyAsync(c => c.CourseId == dto.CourseId))
            {
                return BadRequest($"Invalid CourseId: {dto.CourseId}");
            }

            enrollment.StudentId = dto.StudentId;
            enrollment.CourseId = dto.CourseId;
            

            _context.Entry(enrollment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EnrollmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> Delete(int id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null)
            {
                return NotFound();
            }

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EnrollmentExists(int id)
        {
            return _context.Enrollments.Any(e => e.EnrollmentId == id);
        }
    }
}