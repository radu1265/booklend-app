package com.example.booklend.repository;

import com.example.booklend.model.Book;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
 
@SpringBootTest
@Transactional
class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Test
    @DisplayName("Should save book successfully")
    void testSaveBook_Success() {
        
        Book book = new Book("Test Book", "Test Author", "Fiction", "Summary", 10, "test.jpg");

        
        Book saved = bookRepository.save(book);

        
        assertNotNull(saved.getId());
        assertEquals("Test Book", saved.getTitle());
        assertEquals("Test Author", saved.getAuthor());
        assertEquals("Fiction", saved.getGenre());
        assertEquals(10, saved.getStockCount());
    }

    @Test
    @DisplayName("Should find book by ID")
    void testFindById_Success() {
        
        Book book = new Book("Find Me", "Author", "Genre", "Summary", 5, "find.jpg");
        Book saved = bookRepository.save(book);

        
        Optional<Book> found = bookRepository.findById(saved.getId());

        
        assertTrue(found.isPresent());
        assertEquals("Find Me", found.get().getTitle());
    }

    @Test
    @DisplayName("Should return empty when book ID does not exist")
    void testFindById_NotFound() {
        
        Optional<Book> found = bookRepository.findById(9999L);

        
        assertFalse(found.isPresent());
    }

    @Test
    @DisplayName("Should find all books")
    void testFindAll_Success() {
        
        long initialCount = bookRepository.count();
        Book book1 = new Book("Book 1", "Author 1", "Fiction", "Summary", 5, "book1.jpg");
        Book book2 = new Book("Book 2", "Author 2", "Fantasy", "Summary", 3, "book2.jpg");
        bookRepository.save(book1);
        bookRepository.save(book2);

        
        List<Book> books = bookRepository.findAll();

        
        assertEquals(initialCount + 2, books.size());
    }

    @Test
    @DisplayName("Should update book successfully")
    void testUpdateBook_Success() {
        
        Book book = new Book("Original Title", "Author", "Genre", "Summary", 10, "original.jpg");
        Book saved = bookRepository.save(book);

        
        saved.setTitle("Updated Title");
        saved.setStockCount(5);
        Book updated = bookRepository.save(saved);

        
        assertEquals("Updated Title", updated.getTitle());
        assertEquals(5, updated.getStockCount());
    }

    @Test
    @DisplayName("Should delete book successfully")
    void testDeleteBook_Success() {
        
        Book book = new Book("Delete Me", "Author", "Genre", "Summary", 10, "delete.jpg");
        Book saved = bookRepository.save(book);
        Long bookId = saved.getId();

        
        bookRepository.deleteById(bookId);

        
        Optional<Book> found = bookRepository.findById(bookId);
        assertFalse(found.isPresent());
    }

    @Test
    @DisplayName("Should persist all book fields correctly")
    void testSaveBook_AllFields() {
        
        Book book = new Book(
                "Complete Book",
                "Complete Author",
                "Complete Genre",
                "Complete Summary with details",
                15,
                "complete.jpg"
        );

        
        Book saved = bookRepository.save(book);

        Optional<Book> reloaded = bookRepository.findById(saved.getId());

        
        assertTrue(reloaded.isPresent());
        Book book2 = reloaded.get();
        assertEquals("Complete Book", book2.getTitle());
        assertEquals("Complete Author", book2.getAuthor());
        assertEquals("Complete Genre", book2.getGenre());
        assertEquals("Complete Summary with details", book2.getSummary());
        assertEquals(15, book2.getStockCount());
        assertEquals("complete.jpg", book2.getImageFilename());
    }

    @Test
    @DisplayName("Should handle book with zero stock")
    void testSaveBook_ZeroStock() {
        
        Book book = new Book("No Stock", "Author", "Genre", "Summary", 0, "nostock.jpg");

        
        Book saved = bookRepository.save(book);

        
        assertEquals(0, saved.getStockCount());
    }

    @Test
    @DisplayName("Should handle book with large stock count")
    void testSaveBook_LargeStock() {
        
        Book book = new Book("Popular Book", "Author", "Genre", "Summary", 1000, "popular.jpg");

        
        Book saved = bookRepository.save(book);

        
        assertEquals(1000, saved.getStockCount());
    }

    @Test
    @DisplayName("Should count books correctly")
    void testCount_Success() {
        
        long initialCount = bookRepository.count();
        Book book1 = new Book("Book 1", "Author", "Genre", "Summary", 5, "book1.jpg");
        Book book2 = new Book("Book 2", "Author", "Genre", "Summary", 5, "book2.jpg");
        Book book3 = new Book("Book 3", "Author", "Genre", "Summary", 5, "book3.jpg");
        bookRepository.save(book1);
        bookRepository.save(book2);
        bookRepository.save(book3);

        
        long count = bookRepository.count();

        
        assertEquals(initialCount + 3, count);
    }

    @Test
    @DisplayName("Should handle null values for optional fields")
    void testSaveBook_NullOptionalFields() {
        
        Book book = new Book("Required Only", "Author", null, null, null, null);

        
        Book saved = bookRepository.save(book);

        
        assertNotNull(saved.getId());
        assertEquals("Required Only", saved.getTitle());
        assertEquals("Author", saved.getAuthor());
        assertNull(book.getGenre());
        assertNull(book.getSummary());
    }
}
