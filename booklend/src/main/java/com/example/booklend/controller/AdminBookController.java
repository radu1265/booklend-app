package com.example.booklend.controller;

import com.example.booklend.dto.BookCreateDto;
import com.example.booklend.model.Book;
import com.example.booklend.service.AdminBookService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/books")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminBookController {
	@Autowired
	private AdminBookService adminBookService;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> createBook(
			@Parameter(
					description = "Book details",
					content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
			)
			@RequestPart("book") BookCreateDto book,
			@RequestPart(value = "image", required = false) MultipartFile image) {
		return adminBookService.create(book, image);
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody Book book) {
		return adminBookService.update(id, book);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteBook(@PathVariable Long id) {
		return adminBookService.delete(id);
	}
}
