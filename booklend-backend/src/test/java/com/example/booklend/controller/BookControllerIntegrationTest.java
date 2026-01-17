package com.example.booklend.controller;

import com.example.booklend.model.Book;
import com.example.booklend.repository.BookRepository;
import com.example.booklend.repository.RentalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Integration tests for BookController
 * Tests the full Spring context with actual database interactions
 */
@SpringBootTest
class BookControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private RentalRepository rentalRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        rentalRepository.deleteAll();
        bookRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return empty array when no books exist")
    void testListBooks_EmptyDatabase() throws Exception {
        mockMvc.perform(get("/api/books")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("Should return all books when books exist in database")
    void testListBooks_WithData() throws Exception {
        Book book1 = new Book("The Hobbit", "J.R.R. Tolkien", "Fantasy", "A fantasy adventure", 10, "hobbit.jpg");
        Book book2 = new Book("Pride and Prejudice", "Jane Austen", "Romance", "Classic romance", 5, "pride.jpg");
        bookRepository.save(book1);
        bookRepository.save(book2);

        mockMvc.perform(get("/api/books")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("The Hobbit")))
                .andExpect(jsonPath("$[0].author", is("J.R.R. Tolkien")))
                .andExpect(jsonPath("$[0].genre", is("Fantasy")))
                .andExpect(jsonPath("$[0].stockCount", is(10)))
                .andExpect(jsonPath("$[1].title", is("Pride and Prejudice")))
                .andExpect(jsonPath("$[1].author", is("Jane Austen")));
    }

    @Test
    @DisplayName("Should return specific book by ID")
    void testGetBook_Success() throws Exception {
        Book book = new Book("Clean Code", "Robert C. Martin", "Programming", "Coding best practices", 8, "clean.jpg");
        Book saved = bookRepository.save(book);

        mockMvc.perform(get("/api/books/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title", is("Clean Code")))
                .andExpect(jsonPath("$.author", is("Robert C. Martin")))
                .andExpect(jsonPath("$.genre", is("Programming")))
                .andExpect(jsonPath("$.stockCount", is(8)));
    }

    @Test
    @DisplayName("Should return 404 when book ID does not exist")
    void testGetBook_NotFound() throws Exception {
        mockMvc.perform(get("/api/books/9999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should handle book with zero stock count")
    void testGetBook_ZeroStock() throws Exception {
        Book book = new Book("Out of Stock", "Author", "Genre", "Summary", 0, "book.jpg");
        Book saved = bookRepository.save(book);

        mockMvc.perform(get("/api/books/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stockCount", is(0)));
    }
}
