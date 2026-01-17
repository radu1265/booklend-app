package com.example.booklend.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Book model
 * Testing entity behavior and validation
 */
class BookTest {

    @Test
    @DisplayName("Should create book with all parameters using constructor")
    void testBookConstructor_AllParameters() {
        // Act
        Book book = new Book(
                "Test Title",
                "Test Author",
                "Test Genre",
                "Test Summary",
                10,
                "test.jpg"
        );

        // Assert
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
        // Act
        Book book = new Book();

        // Assert
        assertNull(book.getId());
        assertNull(book.getTitle());
        assertNull(book.getAuthor());
    }

    @Test
    @DisplayName("Should set and get ID correctly")
    void testBookSetAndGetId() {
        // Arrange
        Book book = new Book();

        // Act
        book.setId(1L);

        // Assert
        assertEquals(1L, book.getId());
    }

    @Test
    @DisplayName("Should set and get title correctly")
    void testBookSetAndGetTitle() {
        // Arrange
        Book book = new Book();

        // Act
        book.setTitle("New Title");

        // Assert
        assertEquals("New Title", book.getTitle());
    }

    @Test
    @DisplayName("Should set and get author correctly")
    void testBookSetAndGetAuthor() {
        // Arrange
        Book book = new Book();

        // Act
        book.setAuthor("New Author");

        // Assert
        assertEquals("New Author", book.getAuthor());
    }

    @Test
    @DisplayName("Should set and get stock count correctly")
    void testBookSetAndGetStockCount() {
        // Arrange
        Book book = new Book();

        // Act
        book.setStockCount(25);

        // Assert
        assertEquals(25, book.getStockCount());
    }

    @Test
    @DisplayName("Should handle zero stock count")
    void testBookWithZeroStock() {
        // Arrange
        Book book = new Book();

        // Act
        book.setStockCount(0);

        // Assert
        assertEquals(0, book.getStockCount());
    }

    @Test
    @DisplayName("Should handle null genre")
    void testBookWithNullGenre() {
        // Arrange
        Book book = new Book();

        // Act
        book.setGenre(null);

        // Assert
        assertNull(book.getGenre());
    }

    @Test
    @DisplayName("Should create two equal books using all-args constructor")
    void testBookEquality_AllArgsConstructor() {
        // Arrange & Act
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

        // Assert
        assertEquals(book1, book2);
        assertEquals(book1.hashCode(), book2.hashCode());
    }

    @Test
    @DisplayName("Should handle long summary text")
    void testBookWithLongSummary() {
        // Arrange
        String longSummary = "This is a very long summary that contains multiple sentences. " +
                "It describes the book in great detail. " +
                "The summary can be quite lengthy and include various information about the plot, " +
                "characters, and themes of the book.";
        Book book = new Book();

        // Act
        book.setSummary(longSummary);

        // Assert
        assertEquals(longSummary, book.getSummary());
        assertTrue(book.getSummary().length() > 100);
    }

    @Test
    @DisplayName("Should handle special characters in title and author")
    void testBookWithSpecialCharacters() {
        // Arrange
        Book book = new Book();

        // Act
        book.setTitle("Book: The Sequel - Part #2");
        book.setAuthor("O'Brien-Smith");

        // Assert
        assertEquals("Book: The Sequel - Part #2", book.getTitle());
        assertEquals("O'Brien-Smith", book.getAuthor());
    }

    @Test
    @DisplayName("Should update stock count multiple times")
    void testBookStockCountUpdate() {
        // Arrange
        Book book = new Book();
        book.setStockCount(10);

        // Act
        book.setStockCount(book.getStockCount() - 1);
        assertEquals(9, book.getStockCount());

        book.setStockCount(book.getStockCount() - 1);
        assertEquals(8, book.getStockCount());

        book.setStockCount(book.getStockCount() + 5);

        // Assert
        assertEquals(13, book.getStockCount());
    }
}
