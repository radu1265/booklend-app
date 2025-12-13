// java
package com.example.booklend.mapper;

import com.example.booklend.dto.RentalDto;
import com.example.booklend.model.Rental;

import java.util.List;
import java.util.stream.Collectors;

public final class RentalMapper {
    private RentalMapper() {}

    public static RentalDto toDto(Rental rental) {
        if (rental == null) return null;
        RentalDto d = new RentalDto();
        d.setId(rental.getId());
        if (rental.getBook() != null) {
            d.setBookId(rental.getBook().getId());
            d.setBookTitle(rental.getBook().getTitle());
            d.setBookAuthor(rental.getBook().getAuthor());
        }
        d.setRentalDate(rental.getRentalDate());
        d.setDueDate(rental.getDueDate());
        d.setReturned(rental.isReturned());
        return d;
    }

    public static List<RentalDto> toDtoList(List<Rental> rentals) {
        return rentals.stream().map(RentalMapper::toDto).collect(Collectors.toList());
    }
}
