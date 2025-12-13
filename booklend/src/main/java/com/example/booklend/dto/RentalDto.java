// java
package com.example.booklend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RentalDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private LocalDate rentalDate;
    private LocalDate dueDate;
    private boolean returned;

}
