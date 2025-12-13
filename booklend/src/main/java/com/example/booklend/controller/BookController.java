package com.example.booklend.controller;

import com.example.booklend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:4200")
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping
    public ResponseEntity<?> listBooks() {
        return bookService.listAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBook(@PathVariable Long id) {
        return bookService.getById(id);
    }
}
