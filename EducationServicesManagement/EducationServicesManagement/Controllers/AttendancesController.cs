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
    public class AttendancesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendancesController(AppDbContext context) => _context = context;

        
        [HttpGet]
        [Authorize(Roles = "Admin, Teacher")] 
        public async Task<ActionResult<IEnumerable<AttendanceDto>>> Get()
        {
            var attendances = await _context.Attendances
                .Include(a => a.Course)
                .Include(a => a.Student)
                .Select(a => new AttendanceDto
                {
                    AttendanceId = a.AttendanceId,
                    StudentId = a.StudentId,
                    StudentName = a.Student.FullName,
                    CourseId = a.CourseId,
                    CourseName = a.Course.CourseName,
                    AttendanceDate = a.AttendanceDate,
                    IsPresent = a.IsPresent
                }).ToListAsync();

            return Ok(attendances);
        }

       
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Teacher, Student")] 
        public async Task<ActionResult<AttendanceDto>> Get(int id)
        {
            var attendance = await _context.Attendances
                .Include(a => a.Course)
                .Include(a => a.Student)
                .FirstOrDefaultAsync(a => a.AttendanceId == id);

            if (attendance == null)
            {
                return NotFound();
            }

  
            if (User.IsInRole("Student") && attendance.Student.Email != User.Identity.Name)
            {
                return Forbid();
            }

            var dto = new AttendanceDto
            {
                AttendanceId = attendance.AttendanceId,
                StudentId = attendance.StudentId,
                StudentName = attendance.Student.FullName,
                CourseId = attendance.CourseId,
                CourseName = attendance.Course.CourseName,
                AttendanceDate = attendance.AttendanceDate,
                IsPresent = attendance.IsPresent
            };

            return Ok(dto);
        }

       
        [HttpPost]
        [Authorize(Roles = "Admin, Teacher")] 
        public async Task<ActionResult> Post([FromBody] AttendanceDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!await _context.Students.AnyAsync(s => s.StudentId == dto.StudentId) ||
                !await _context.Courses.AnyAsync(c => c.CourseId == dto.CourseId))
            {
                return BadRequest("Invalid StudentId or CourseId");
            }

            var attendance = new Attendance
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                AttendanceDate = dto.AttendanceDate,
                IsPresent = dto.IsPresent
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

          
            return CreatedAtAction(nameof(Get), new { id = attendance.AttendanceId }, dto);
        }

        
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Teacher")] 
        public async Task<IActionResult> Put(int id, [FromBody] AttendanceDto dto)
        {
            if (id != dto.AttendanceId)
            {
                return BadRequest();
            }

            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            
            attendance.StudentId = dto.StudentId;
            attendance.CourseId = dto.CourseId;
            attendance.AttendanceDate = dto.AttendanceDate;
            attendance.IsPresent = dto.IsPresent;

            _context.Entry(attendance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttendanceExists(id))
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
        [Authorize(Roles = "Admin, Teacher")] 
        public async Task<IActionResult> Delete(int id)
        {
            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttendanceExists(int id)
        {
            return _context.Attendances.Any(e => e.AttendanceId == id);
        }
    }
}