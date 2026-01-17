export async function createBook(book: Partial<Book>, imageFile?: File): Promise<{ success: boolean; book?: Book; message?: string }> {
    const formData = new FormData();
    formData.append("book", new Blob([JSON.stringify(book)], { type: "application/json" }));
    if (imageFile) formData.append("image", imageFile);
    try {
        const response = await fetch(`${API_BASE_URL}/admin/books`, {
            method: "POST",
            headers: {
                ...authHeaders(),
            },
            body: formData,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            return { success: false, message: data.message || "Failed to create book" };
        }
        return { success: true, book: data, message: "Book created" };
    } catch (error) {
        return { success: false, message: "Error creating book" };
    }
}

export async function updateBook(id: number, book: Partial<Book>): Promise<{ success: boolean; book?: Book; message?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/books/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(),
            },
            body: JSON.stringify(book),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            return { success: false, message: data.message || "Failed to update book" };
        }
        return { success: true, book: data, message: "Book updated" };
    } catch (error) {
        return { success: false, message: "Error updating book" };
    }
}

export async function deleteBook(id: number): Promise<{ success: boolean; message?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/books/${id}`, {
            method: "DELETE",
            headers: {
                ...authHeaders(),
            },
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { success: false, message: data.message || "Failed to delete book" };
        }
        return { success: true, message: "Book deleted" };
    } catch (error) {
        return { success: false, message: "Error deleting book" };
    }
}
const API_BASE_URL = "http://localhost:8081/api";
import { getToken } from "./auth";

export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    summary: string;
    stockCount: number;
    borrowedCount?: number;
    imageFilename: string | null;
}

export interface Rental {
    id: number;
    bookId: number;
    bookTitle: string;
    bookAuthor: string;
    rentalDate: string;
    dueDate: string;
    returned: boolean;
}

export async function fetchBooks(): Promise<Book[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}

function authHeaders(): Record<string, string> {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchRentals(): Promise<Rental[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/rentals/my`, {
            headers: {
                ...authHeaders(),
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch rentals");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching rentals:", error);
        return [];
    }
}

export interface CurrentUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                ...authHeaders(),
            },
        });
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
}

export async function fetchBookById(id: number): Promise<Book | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch book");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching book:", error);
        return null;
    }
}

export async function borrowBook({ bookId, days, dueDate }: { bookId: number; days?: number; dueDate?: string }): Promise<{ success: boolean; message: string }> {
    try {
        const params = new URLSearchParams({ bookId: String(bookId) });
        if (days && days > 0) params.append("days", String(days));
        if (dueDate) params.append("dueDate", dueDate);

        const response = await fetch(`${API_BASE_URL}/rentals?${params.toString()}`, {
            method: "POST",
            headers: {
                ...authHeaders(),
            },
        });
        
        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            return {
                success: false,
                message: data.message || data || "Failed to borrow book"
            };
        }
        
        return {
            success: true,
            message: data.message || "Book borrowed successfully!"
        };
    } catch (error) {
        console.error("Error borrowing book:", error);
        return {
            success: false,
            message: "An error occurred while borrowing the book"
        };
    }
}

export async function returnBook(rentalId: number): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/return`, {
            method: "POST",
            headers: {
                ...authHeaders(),
            },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            return {
                success: false,
                message: data.message || data || "Failed to return book"
            };
        }
        return {
            success: true,
            message: data.message || "Book returned successfully!"
        };
    } catch (error) {
        console.error("Error returning book:", error);
        return {
            success: false,
            message: "An error occurred while returning the book"
        };
    }
}

export function getBookImageUrl(book: Book): string {
    if (book.imageFilename) {
        return `${API_BASE_URL.replace("/api", "")}/uploads/${book.imageFilename}`;
    }
    const genrePlaceholders: Record<string, string> = {
        Fiction:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
        Fantasy:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop",
        Romance:
            "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=600&fit=crop",
        Dystopian:
            "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=600&fit=crop",
        default:
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    };
    return genrePlaceholders[book.genre] || genrePlaceholders.default;
}

