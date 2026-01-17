package com.example.booklend.service;

import com.example.booklend.model.Book;
import com.example.booklend.repository.BookRepository;
import com.example.booklend.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private RentalRepository rentalRepository;

    public ResponseEntity<?> listAll() {
        List<Book> books = bookRepository.findAll();
        // Populate transient borrowedCount for client display
        books.forEach(b -> b.setBorrowedCount(rentalRepository.countByBookIdAndReturnedFalse(b.getId())));
        return ResponseEntity.ok(books);
    }

    public ResponseEntity<?> getById(Long id) {
        Optional<Book> b = bookRepository.findById(id);
        b.ifPresent(book -> book.setBorrowedCount(rentalRepository.countByBookIdAndReturnedFalse(book.getId())));
        return b.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
