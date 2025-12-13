package com.example.booklend.service;

import com.example.booklend.dto.BookCreateDto;
import com.example.booklend.model.Book;
import com.example.booklend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class AdminBookService {
	@Autowired
	private BookRepository bookRepository;

	@Autowired
	private FileStorageService fileStorageService;

	public ResponseEntity<?> create(BookCreateDto bookDto, MultipartFile image) {
		try {
			Book book = new Book();
			book.setTitle(bookDto.getTitle());
			book.setAuthor(bookDto.getAuthor());
			book.setGenre(bookDto.getGenre());
			book.setSummary(bookDto.getSummary());
			book.setStockCount(bookDto.getStockCount());

			if (image != null && !image.isEmpty()) {
				if (image.getContentType() == null || !image.getContentType().startsWith("image/")) {
					return ResponseEntity.badRequest().body("File is not an image");
				}
				String filename = fileStorageService.store(image);
				book.setImageFilename(filename);
			}

			Book saved = bookRepository.save(book);
			return ResponseEntity.status(201).body(saved);
		} catch (IOException e) {
			return ResponseEntity.status(500).body("Failed to store image");
		}
	}

	public ResponseEntity<?> update(Long id, Book update) {
		Optional<Book> existing = bookRepository.findById(id);
		if (existing.isEmpty()) return ResponseEntity.notFound().build();
		Book b = existing.get();
		b.setTitle(update.getTitle());
		b.setAuthor(update.getAuthor());
		b.setGenre(update.getGenre());
		b.setSummary(update.getSummary());
		b.setStockCount(update.getStockCount());
		Book saved = bookRepository.save(b);
		return ResponseEntity.ok(saved);
	}

	public ResponseEntity<?> delete(Long id) {
		if (!bookRepository.existsById(id)) return ResponseEntity.notFound().build();
		bookRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}
}
