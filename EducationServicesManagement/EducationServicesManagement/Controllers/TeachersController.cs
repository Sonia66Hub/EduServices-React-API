using EducationServicesManagement.Data;
using EducationServicesManagement.Models;
using EducationServicesManagement.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Hosting; 
using System.Security.Claims; 

namespace EducationServicesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TeachersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public TeachersController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

       
        [HttpGet]
        [Authorize(Roles = "Admin, Teacher, Student")] 
        public async Task<ActionResult<IEnumerable<TeacherDto>>> GetTeachers()
        {
            var teachers = await _context.Teachers.Include(t => t.Department).ToListAsync();

            var dtoList = teachers.Select(t => new TeacherDto
            {
                TeacherId = t.TeacherId,
                Name = t.Name,
                DepartmentId = t.DepartmentId,
                DepartmentName = t.Department?.DepartmentName,
                Picture = GetPictureUrl(t.Picture)
            }).ToList();

            return Ok(dtoList);
        }

        
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Teacher, Student")] 
        public async Task<ActionResult<TeacherDto>> GetTeacher(int id)
        {
            var teacher = await _context.Teachers.Include(t => t.Department)
                .FirstOrDefaultAsync(t => t.TeacherId == id);

            if (teacher == null) return NotFound();

           

            var dto = new TeacherDto
            {
                TeacherId = teacher.TeacherId,
                Name = teacher.Name,
                DepartmentId = teacher.DepartmentId,
                DepartmentName = teacher.Department?.DepartmentName,
                Picture = GetPictureUrl(teacher.Picture)
            };

            return Ok(dto);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] 
        public async Task<ActionResult<TeacherDto>> PostTeacher([FromForm] TeacherDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

           
            if (dto.DepartmentId.HasValue && !await _context.Departments.AnyAsync(d => d.DepartmentId == dto.DepartmentId.Value))
            {
                return BadRequest($"Invalid DepartmentId: {dto.DepartmentId}");
            }

            var teacher = new Teacher
            {
                Name = dto.Name,
                DepartmentId = dto.DepartmentId ?? 0,  
                Picture = "noimage.png"
            };

            if (dto.PictureFile != null)
            {
                teacher.Picture = await SaveImage(dto.PictureFile);
            }

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

           
            var newDto = new TeacherDto
            {
                TeacherId = teacher.TeacherId,
                Name = teacher.Name,
                DepartmentId = teacher.DepartmentId,
                DepartmentName = (await _context.Departments.FindAsync(teacher.DepartmentId))?.DepartmentName,
                Picture = GetPictureUrl(teacher.Picture)
            };

            return CreatedAtAction(nameof(GetTeacher), new { id = teacher.TeacherId }, newDto);
        }

       
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Teacher")] 
        public async Task<IActionResult> PutTeacher(int id, [FromForm] TeacherDto dto)
        {
            if (id != dto.TeacherId)
            {
                return BadRequest("Mismatched ID in URL and DTO.");
            }

            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

           
            if (dto.DepartmentId.HasValue && !await _context.Departments.AnyAsync(d => d.DepartmentId == dto.DepartmentId.Value))
            {
                return BadRequest($"Invalid DepartmentId: {dto.DepartmentId}");
            }

            teacher.Name = dto.Name;
            teacher.DepartmentId = dto.DepartmentId ?? 0; 

            if (dto.PictureFile != null)
            {
                if (teacher.Picture != "noimage.png")
                    DeleteImage(teacher.Picture); 

                teacher.Picture = await SaveImage(dto.PictureFile); 
            }

            _context.Entry(teacher).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeacherExists(id))
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
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            if (teacher.Picture != "noimage.png")
                DeleteImage(teacher.Picture); 

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

       
        private bool TeacherExists(int id)
        {
            return _context.Teachers.Any(e => e.TeacherId == id);
        }

        [NonAction]
        private async Task<string> SaveImage(IFormFile file)
        {
            string folderPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            
            string fileName = Path.GetFileNameWithoutExtension(file.FileName)
                                .Replace(" ", "_") 
                                + "_" + Guid.NewGuid().ToString() 
                                + Path.GetExtension(file.FileName); 

            string fullPath = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return "/uploads/" + fileName; 
        }

        [NonAction]
        private void DeleteImage(string path)
        {
            if (string.IsNullOrEmpty(path) || path == "noimage.png") return; 

           
            string file = path.StartsWith("/") ? path.Substring(1) : path;
            string fullPath = Path.Combine(_env.WebRootPath, file);

            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath); 
            }
        }

        [NonAction]
        private string GetPictureUrl(string path)
        {
            if (string.IsNullOrEmpty(path) || path == "noimage.png") return null; 

           
            return $"{Request.Scheme}://{Request.Host}/uploads/{Path.GetFileName(path)}";
        }
    }
}