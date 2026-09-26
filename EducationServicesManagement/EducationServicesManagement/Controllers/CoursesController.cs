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
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CoursesController(AppDbContext context) => _context = context;

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseDto>>> Get()
        {
            var courses = await _context.Courses
                .Select(c => new CourseDto
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName
                })
                .ToListAsync();

            return Ok(courses);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDto>> Get(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            var dto = new CourseDto
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName
            };

            return Ok(dto);
        }

        
        [HttpPost]
        [Authorize(Roles = "Admin")] 
        public async Task<ActionResult<CourseDto>> Post(CourseDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var entity = new Course { CourseName = dto.CourseName };
            _context.Courses.Add(entity);
            await _context.SaveChangesAsync();

            var createdDto = new CourseDto { CourseId = entity.CourseId, CourseName = entity.CourseName };
            return CreatedAtAction(nameof(Get), new { id = entity.CourseId }, createdDto);
        }

       
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> Put(int id, CourseDto dto)
        {
            

            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            course.CourseName = dto.CourseName;
            _context.Entry(course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
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
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseExists(int id)
        {
            return _context.Courses.Any(e => e.CourseId == id);
        }
    }
}