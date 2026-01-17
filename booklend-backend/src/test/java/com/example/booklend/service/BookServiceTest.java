package com.example.booklend.service;

import com.example.booklend.model.Book;
import com.example.booklend.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for BookService
 * Tests business logic in isolation using mocked dependencies
 */
@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    private Book testBook1;
    private Book testBook2;

    @BeforeEach
    void setUp() {
        testBook1 = new Book(
                "The Great Gatsby",
                "F. Scott Fitzgerald",
                "Fiction",
                "A classic American novel",
                5,
                "gatsby.jpg"
        );
        testBook1.setId(1L);

        testBook2 = new Book(
                "1984",
                "George Orwell",
                "Dystopian",
                "A dystopian social science fiction novel",
                3,
                "1984.jpg"
        );
        testBook2.setId(2L);
    }

    // Positive test cases

    @Test
    @DisplayName("Should return list of all books when books exist")
    void testListAll_Success() {
        // Arrange
        List<Book> books = Arrays.asList(testBook1, testBook2);
        when(bookRepository.findAll()).thenReturn(books);

        // Act
        ResponseEntity<?> response = bookService.listAll();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        @SuppressWarnings("unchecked")
        List<Book> returnedBooks = (List<Book>) response.getBody();
        assertEquals(2, returnedBooks.size());
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no books exist")
    void testListAll_EmptyList() {
        // Arrange
        when(bookRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<?> response = bookService.listAll();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        @SuppressWarnings("unchecked")
        List<Book> returnedBooks = (List<Book>) response.getBody();
        assertEquals(0, returnedBooks.size());
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return book when valid ID is provided")
    void testGetById_Success() {
        // Arrange
        Long bookId = 1L;
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(testBook1));

        // Act
        ResponseEntity<?> response = bookService.getById(bookId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        Book returnedBook = (Book) response.getBody();
        assertEquals("The Great Gatsby", returnedBook.getTitle());
        assertEquals("F. Scott Fitzgerald", returnedBook.getAuthor());
        verify(bookRepository, times(1)).findById(bookId);
    }

    // Negative test cases

    @Test
    @DisplayName("Should return 404 when book ID does not exist")
    void testGetById_NotFound() {
        // Arrange
        Long nonExistentId = 999L;
        when(bookRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = bookService.getById(nonExistentId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(bookRepository, times(1)).findById(nonExistentId);
    }

    // Boundary value testing

    @Test
    @DisplayName("Should handle book with minimum stock count (0)")
    void testGetById_WithZeroStock() {
        // Arrange
        Book outOfStockBook = new Book(
                "Out of Stock Book",
                "Author",
                "Genre",
                "Summary",
                0,
                "book.jpg"
        );
        outOfStockBook.setId(3L);
        when(bookRepository.findById(3L)).thenReturn(Optional.of(outOfStockBook));

        // Act
        ResponseEntity<?> response = bookService.getById(3L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Book returnedBook = (Book) response.getBody();
        assertEquals(0, returnedBook.getStockCount());
    }

    @Test
    @DisplayName("Should handle null ID gracefully")
    void testGetById_NullId() {
        // Arrange
        when(bookRepository.findById(null)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = bookService.getById(null);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
