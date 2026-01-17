package com.example.booklend.service;

import com.example.booklend.dto.RentalDto;
import com.example.booklend.model.Book;
import com.example.booklend.model.Rental;
import com.example.booklend.model.User;
import com.example.booklend.repository.BookRepository;
import com.example.booklend.repository.RentalRepository;
import com.example.booklend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for RentalService
 * Testing rental business logic with equivalence partitioning and boundary analysis
 */
@ExtendWith(MockitoExtension.class)
class RentalServiceTest {

    @Mock
    private RentalRepository rentalRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private RentalService rentalService;

    private User testUser;
    private Book testBook;
    private Rental testRental;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@test.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");

        testBook = new Book(
                "Test Book",
                "Test Author",
                "Fiction",
                "Test Summary",
                5,
                "test.jpg"
        );
        testBook.setId(1L);

        testRental = new Rental();
        testRental.setId(1L);
        testRental.setUser(testUser);
        testRental.setBook(testBook);
        testRental.setRentalDate(LocalDate.now());
        testRental.setDueDate(LocalDate.now().plusWeeks(2));
        testRental.setReturned(false);
    }

    // Positive test cases

    @Test
    @DisplayName("Should successfully reserve book when all conditions are met")
    void testReserveBook_Success() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(rentalRepository.save(any(Rental.class))).thenReturn(testRental);

        // Act
        ResponseEntity<?> response = rentalService.reserveBook(1L, 14, null, userDetails);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof RentalDto);
        verify(bookRepository, times(1)).save(any(Book.class));
        verify(rentalRepository, times(1)).save(any(Rental.class));
    }

    @Test
    @DisplayName("Should use default 2-week period when days is null")
    void testReserveBook_WithDefaultDays() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(rentalRepository.save(any(Rental.class))).thenReturn(testRental);

        // Act
        ResponseEntity<?> response = rentalService.reserveBook(1L, null, null, userDetails);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(rentalRepository, times(1)).save(any(Rental.class));
    }

    @Test
    @DisplayName("Should use provided due date when specified")
    void testReserveBook_WithSpecificDueDate() {
        // Arrange
        String futureDate = LocalDate.now().plusDays(30).toString();
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(rentalRepository.save(any(Rental.class))).thenReturn(testRental);

        // Act
        ResponseEntity<?> response = rentalService.reserveBook(1L, null, futureDate, userDetails);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(rentalRepository, times(1)).save(any(Rental.class));
    }

    // Negative test cases

    @Test
    @DisplayName("Should return 404 when book does not exist")
    void testReserveBook_BookNotFound() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = rentalService.reserveBook(999L, 14, null, userDetails);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(rentalRepository, never()).save(any(Rental.class));
    }

    @Test
    @DisplayName("Should return 400 when book is out of stock")
    void testReserveBook_OutOfStock() {
        // Arrange
        testBook.setStockCount(0);
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        // Act
        ResponseEntity<?> response = rentalService.reserveBook(1L, 14, null, userDetails);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Book is out of stock", response.getBody());
        verify(rentalRepository, never()).save(any(Rental.class));
    }

    @Test
    @DisplayName("Should return 400 when due date format is invalid")
    void testReserveBook_InvalidDateFormat() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        // Act
        ResponseEntity<?> response = rentalService.reserveBook(1L, null, "invalid-date", userDetails);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Invalid dueDate format"));
        verify(rentalRepository, never()).save(any(Rental.class));
    }

    @Test
    @DisplayName("Should return 401 when user is not authenticated")
    void testReserveBook_Unauthorized() {
        // Act
        ResponseEntity<?> response = rentalService.reserveBook(1L, 14, null, null);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Unauthorized", response.getBody());
        verify(rentalRepository, never()).save(any(Rental.class));
    }

    // Boundary value testing

    @Test
    @DisplayName("Should handle book with exactly 1 stock item")
    void testReserveBook_LastStockItem() {
        // Arrange
        testBook.setStockCount(1);
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(rentalRepository.save(any(Rental.class))).thenReturn(testRental);

        // Act
        ResponseEntity<?> response = rentalService.reserveBook(1L, 14, null, userDetails);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(bookRepository, times(1)).save(argThat(book -> book.getStockCount() == 0));
    }

    @Test
    @DisplayName("Should handle minimum rental days (1 day)")
    void testReserveBook_MinimumDays() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(rentalRepository.save(any(Rental.class))).thenReturn(testRental);

        // Act
        ResponseEntity<?> response = rentalService.reserveBook(1L, 1, null, userDetails);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(rentalRepository, times(1)).save(any(Rental.class));
    }

    @Test
    @DisplayName("Should handle zero or negative days by using default period")
    void testReserveBook_ZeroDays() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(rentalRepository.save(any(Rental.class))).thenReturn(testRental);

        // Act
        ResponseEntity<?> response = rentalService.reserveBook(1L, 0, null, userDetails);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(rentalRepository, times(1)).save(any(Rental.class));
    }

    @Test
    @DisplayName("Should decrement stock count correctly")
    void testReserveBook_StockDecrement() {
        // Arrange
        testBook.setStockCount(10);
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(rentalRepository.save(any(Rental.class))).thenReturn(testRental);

        // Act
        rentalService.reserveBook(1L, 14, null, userDetails);

        // Assert
        verify(bookRepository, times(1)).save(argThat(book -> book.getStockCount() == 9));
    }
}
