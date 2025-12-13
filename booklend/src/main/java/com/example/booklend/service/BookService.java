package com.example.booklend.service;

import com.example.booklend.model.Book;
import com.example.booklend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public ResponseEntity<?> listAll() {
        List<Book> books = bookRepository.findAll();
        return ResponseEntity.ok(books);
    }

    public ResponseEntity<?> getById(Long id) {
        Optional<Book> b = bookRepository.findById(id);
        return b.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
