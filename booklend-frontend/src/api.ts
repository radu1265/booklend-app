const API_BASE_URL = "http://localhost:8080/api";
import { getToken } from "./auth";

export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    summary: string;
    stockCount: number;
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

function authHeaders() {
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

