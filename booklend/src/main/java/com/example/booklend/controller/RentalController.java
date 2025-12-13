package com.example.booklend.controller;

import com.example.booklend.service.RentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "http://localhost:4200")
public class RentalController {
    @Autowired
    private RentalService rentalService;

    @PostMapping
    public ResponseEntity<?> reserveBook(
            @RequestParam Long bookId,
            @RequestParam(required = false) Integer days,
            @RequestParam(required = false) String dueDate,
            @AuthenticationPrincipal UserDetails userDetails) {
        return rentalService.reserveBook(bookId, days, dueDate, userDetails);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyRentals(@AuthenticationPrincipal UserDetails userDetails) {
        return rentalService.getMyRentals(userDetails);
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<?> renewBook(
            @PathVariable Long id,
            @RequestParam(required = false) Integer days,
            @RequestParam(required = false) String dueDate,
            @AuthenticationPrincipal UserDetails userDetails) {
        return rentalService.renewBook(id, days, dueDate, userDetails);
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<?> returnBook(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return rentalService.returnBook(id, userDetails);
    }
}
