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
    public class SubjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubjectsController(AppDbContext context) => _context = context;

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubjectDto>>> Get()
        {
            var subjects = await _context.Subjects
                .Include(s => s.Course)
                .Select(s => new SubjectDto
                {
                    SubjectId = s.SubjectId,
                    SubjectName = s.SubjectName,
                    CourseId = s.CourseId,
                    CourseName = s.Course.CourseName
                })
                .ToListAsync();

            return Ok(subjects);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<SubjectDto>> Get(int id)
        {
            var subject = await _context.Subjects
                .Include(s => s.Course)
                .FirstOrDefaultAsync(s => s.SubjectId == id);

            if (subject == null)
            {
                return NotFound();
            }

            var dto = new SubjectDto
            {
                SubjectId = subject.SubjectId,
                SubjectName = subject.SubjectName,
                CourseId = subject.CourseId,
                CourseName = subject.Course.CourseName
            };
            return Ok(dto);
        }

       
        [HttpPost]
        [Authorize(Roles = "Admin, Teacher")] 
        public async Task<ActionResult<SubjectDto>> Post([FromBody] SubjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!await _context.Courses.AnyAsync(c => c.CourseId == dto.CourseId))
            {
                return BadRequest($"Invalid CourseId: {dto.CourseId}");
            }

            var entity = new Subject { SubjectName = dto.SubjectName, CourseId = dto.CourseId };
            _context.Subjects.Add(entity);
            await _context.SaveChangesAsync();

           
            var createdDto = new SubjectDto
            {
                SubjectId = entity.SubjectId,
                SubjectName = entity.SubjectName,
                CourseId = entity.CourseId,
                CourseName = _context.Courses.Find(entity.CourseId)?.CourseName 
            };
            return CreatedAtAction(nameof(Get), new { id = entity.SubjectId }, createdDto);
        }

        
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Teacher")] 
        public async Task<IActionResult> Put(int id, [FromBody] SubjectDto dto)
        {
            if (id != dto.SubjectId)
            {
                return BadRequest();
            }

            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return NotFound();
            }

            if (!await _context.Courses.AnyAsync(c => c.CourseId == dto.CourseId))
            {
                return BadRequest($"Invalid CourseId: {dto.CourseId}");
            }

            subject.SubjectName = dto.SubjectName;
            subject.CourseId = dto.CourseId;

            _context.Entry(subject).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectExists(id))
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
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return NotFound();
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubjectExists(int id)
        {
            return _context.Subjects.Any(e => e.SubjectId == id);
        }
    }
}