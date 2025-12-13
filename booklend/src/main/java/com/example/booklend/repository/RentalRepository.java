package com.example.booklend.repository;

import com.example.booklend.model.Rental;
import com.example.booklend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByUserId(Long userId);
}
