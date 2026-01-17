// java
package com.example.booklend.service;

import com.example.booklend.dto.RentalDto;
import com.example.booklend.mapper.RentalMapper;
import com.example.booklend.model.Book;
import com.example.booklend.model.Rental;
import com.example.booklend.model.User;
import com.example.booklend.repository.BookRepository;
import com.example.booklend.repository.RentalRepository;
import com.example.booklend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RentalService {
    private static final int MAX_ACTIVE_RENTALS_PER_USER = 3;
    @Autowired
    private RentalRepository rentalRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;

    private UserDetails ensureUserDetails(UserDetails userDetails) {
        if (userDetails == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserDetails)) {
                return null;
            }
            return (UserDetails) auth.getPrincipal();
        }
        return userDetails;
    }

    public ResponseEntity<?> reserveBook(Long bookId, Integer days, String dueDate, UserDetails userDetails) {
        userDetails = ensureUserDetails(userDetails);
        if (userDetails == null) return ResponseEntity.status(401).body("Unauthorized");

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isEmpty()) return ResponseEntity.notFound().build();
        Book book = bookOpt.get();

        // Prevent duplicate active rentals for the same user and book
        if (rentalRepository.existsByUserIdAndBookIdAndReturnedFalse(user.getId(), bookId)) {
            return ResponseEntity.badRequest().body("You already borrowed this book. Please return it before borrowing again.");
        }

        // Enforce maximum active rentals per user
        long activeRentals = rentalRepository.countByUserIdAndReturnedFalse(user.getId());
        if (activeRentals >= MAX_ACTIVE_RENTALS_PER_USER) {
            return ResponseEntity.badRequest().body(String.format("You have reached the limit of %d active rentals.", MAX_ACTIVE_RENTALS_PER_USER));
        }

        if (book.getStockCount() <= 0) {
            long borrowedCount = rentalRepository.countByBookIdAndReturnedFalse(bookId);
            return ResponseEntity.badRequest().body(String.format("Book is out of stock. Currently borrowed by %d readers.", borrowedCount));
        }

        LocalDate due;
        try {
            if (dueDate != null && !dueDate.isBlank()) {
                due = LocalDate.parse(dueDate);
            } else if (days != null && days > 0) {
                due = LocalDate.now().plusDays(days);
            } else {
                due = LocalDate.now().plusWeeks(2);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid dueDate format. Use yyyy-MM-dd.");
        }

        book.setStockCount(book.getStockCount() - 1);
        bookRepository.save(book);

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setBook(book);
        rental.setRentalDate(LocalDate.now());
        rental.setDueDate(due);
        rental.setReturned(false);
        Rental saved = rentalRepository.save(rental);

        RentalDto dto = RentalMapper.toDto(saved);
        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<?> getMyRentals(UserDetails userDetails) {
        userDetails = ensureUserDetails(userDetails);
        if (userDetails == null) return ResponseEntity.status(401).body("Unauthorized");

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<Rental> rentals = rentalRepository.findByUserId(user.getId());
        return ResponseEntity.ok(RentalMapper.toDtoList(rentals));
    }

    public ResponseEntity<?> renewBook(Long id, Integer days, String dueDate, UserDetails userDetails) {
        userDetails = ensureUserDetails(userDetails);
        if (userDetails == null) return ResponseEntity.status(401).body("Unauthorized");

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Optional<Rental> rentalOpt = rentalRepository.findById(id);
        if (rentalOpt.isEmpty()) return ResponseEntity.notFound().build();
        Rental rental = rentalOpt.get();

        if (!rental.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }

        if (rental.isReturned()) {
            return ResponseEntity.badRequest().body("Cannot renew a returned book");
        }

        LocalDate newDue;
        try {
            if (dueDate != null && !dueDate.isBlank()) {
                newDue = LocalDate.parse(dueDate);
            } else if (days != null && days > 0) {
                newDue = rental.getDueDate().plusDays(days);
            } else {
                newDue = rental.getDueDate().plusWeeks(1);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid dueDate format. Use yyyy-MM-dd.");
        }

        if (newDue.isBefore(rental.getRentalDate())) {
            return ResponseEntity.badRequest().body("Due date cannot be before rental date");
        }

        rental.setDueDate(newDue);
        Rental saved = rentalRepository.save(rental);
        return ResponseEntity.ok(RentalMapper.toDto(saved));
    }

    public ResponseEntity<?> returnBook(Long id, UserDetails userDetails) {
        userDetails = ensureUserDetails(userDetails);
        if (userDetails == null) return ResponseEntity.status(401).body("Unauthorized");

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Optional<Rental> rentalOpt = rentalRepository.findById(id);
        if (rentalOpt.isEmpty()) return ResponseEntity.notFound().build();
        Rental rental = rentalOpt.get();

        if (!rental.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }

        if (rental.isReturned()) {
            return ResponseEntity.badRequest().body("Rental already returned");
        }

        rental.setReturned(true);
        Book book = rental.getBook();
        book.setStockCount(book.getStockCount() + 1);
        bookRepository.save(book);
        Rental saved = rentalRepository.save(rental);

        return ResponseEntity.ok(RentalMapper.toDto(saved));
    }
}
