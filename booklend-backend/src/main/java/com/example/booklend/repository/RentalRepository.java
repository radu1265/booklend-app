package com.example.booklend.repository;

import com.example.booklend.model.Rental;
import com.example.booklend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByUserId(Long userId);
    List<Rental> findByUserIdAndReturnedFalse(Long userId);
    boolean existsByUserIdAndBookIdAndReturnedFalse(Long userId, Long bookId);
    long countByUserIdAndReturnedFalse(Long userId);
    long countByBookIdAndReturnedFalse(Long bookId);
    long deleteByBookId(Long bookId);
}
