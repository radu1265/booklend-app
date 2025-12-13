package com.example.booklend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;
    @NotBlank
    private String author;
    private String genre;
    private String summary;
    private Integer stockCount;
	private String imageFilename;

    public Book(String title, String author, String genre, String summary, Integer stockCount, String imageFilename) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.summary = summary;
        this.stockCount = stockCount;
		this.imageFilename = imageFilename;
    }
}
