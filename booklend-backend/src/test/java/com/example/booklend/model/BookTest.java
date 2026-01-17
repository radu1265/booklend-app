package com.example.booklend.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
 
class BookTest {

    @Test
    @DisplayName("Should create book with all parameters using constructor")
    void testBookConstructor_AllParameters() {
        
        Book book = new Book(
                "Test Title",
                "Test Author",
                "Test Genre",
                "Test Summary",
                10,
                "test.jpg"
        );

        
        assertEquals("Test Title", book.getTitle());
        assertEquals("Test Author", book.getAuthor());
        assertEquals("Test Genre", book.getGenre());
        assertEquals("Test Summary", book.getSummary());
        assertEquals(10, book.getStockCount());
        assertEquals("test.jpg", book.getImageFilename());
    }

    @Test
    @DisplayName("Should create empty book with no-args constructor")
    void testBookConstructor_NoArgs() {
        
        Book book = new Book();

        
        assertNull(book.getId());
        assertNull(book.getTitle());
        assertNull(book.getAuthor());
    }

    @Test
    @DisplayName("Should set and get ID correctly")
    void testBookSetAndGetId() {
        
        Book book = new Book();

        
        book.setId(1L);

        
        assertEquals(1L, book.getId());
    }

    @Test
    @DisplayName("Should set and get title correctly")
    void testBookSetAndGetTitle() {
        
        Book book = new Book();

        
        book.setTitle("New Title");

        
        assertEquals("New Title", book.getTitle());
    }

    @Test
    @DisplayName("Should set and get author correctly")
    void testBookSetAndGetAuthor() {
        
        Book book = new Book();

        
        book.setAuthor("New Author");

        
        assertEquals("New Author", book.getAuthor());
    }

    @Test
    @DisplayName("Should set and get stock count correctly")
    void testBookSetAndGetStockCount() {
        
        Book book = new Book();

        
        book.setStockCount(25);

        
        assertEquals(25, book.getStockCount());
    }

    @Test
    @DisplayName("Should handle zero stock count")
    void testBookWithZeroStock() {
        
        Book book = new Book();

        
        book.setStockCount(0);

        
        assertEquals(0, book.getStockCount());
    }

    @Test
    @DisplayName("Should handle null genre")
    void testBookWithNullGenre() {
        
        Book book = new Book();

        
        book.setGenre(null);

        
        assertNull(book.getGenre());
    }

    @Test
    @DisplayName("Should create two equal books using all-args constructor")
    void testBookEquality_AllArgsConstructor() {
        
        Book book1 = new Book(
                1L,
                "Title",
                "Author",
                "Genre",
                "Summary",
                10,
                "image.jpg"
        );
        Book book2 = new Book(
                1L,
                "Title",
                "Author",
                "Genre",
                "Summary",
                10,
                "image.jpg"
        );

        
        assertEquals(book1, book2);
        assertEquals(book1.hashCode(), book2.hashCode());
    }

    @Test
    @DisplayName("Should handle long summary text")
    void testBookWithLongSummary() {
        
        String longSummary = "This is a very long summary that contains multiple sentences. " +
                "It describes the book in great detail. " +
                "The summary can be quite lengthy and include various information about the plot, " +
                "characters, and themes of the book.";
        Book book = new Book();

        
        book.setSummary(longSummary);

        
        assertEquals(longSummary, book.getSummary());
        assertTrue(book.getSummary().length() > 100);
    }

    @Test
    @DisplayName("Should handle special characters in title and author")
    void testBookWithSpecialCharacters() {
        
        Book book = new Book();

        
        book.setTitle("Book: The Sequel - Part #2");
        book.setAuthor("O'Brien-Smith");

        
        assertEquals("Book: The Sequel - Part #2", book.getTitle());
        assertEquals("O'Brien-Smith", book.getAuthor());
    }

    @Test
    @DisplayName("Should update stock count multiple times")
    void testBookStockCountUpdate() {
        
        Book book = new Book();
        book.setStockCount(10);

        
        book.setStockCount(book.getStockCount() - 1);
        assertEquals(9, book.getStockCount());

        book.setStockCount(book.getStockCount() - 1);
        assertEquals(8, book.getStockCount());

        book.setStockCount(book.getStockCount() + 5);

        
        assertEquals(13, book.getStockCount());
    }
}
