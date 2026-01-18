// Authentication utility for API calls and token storage

const API_BASE_URL = "/api";
const TOKEN_KEY = "booklend_token";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return getToken() !== null;
}

export async function login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: errorText || "Invalid credentials" };
        }

        const data: AuthResponse = await response.json();
        setToken(data.token);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error. Please try again." };
    }
}

export async function register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: errorText || "Registration failed" };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error. Please try again." };
    }
}

export function logout(): void {
    removeToken();
}
