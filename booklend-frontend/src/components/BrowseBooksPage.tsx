import { useState, useEffect, useMemo } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Navbar } from "./Navbar";
import { Search, Filter, Heart, ChevronDown, Loader2, BookOpen } from "lucide-react";
import { fetchBooks, getBookImageUrl, Book } from "../api";

interface BrowseBooksPageProps {
    onNavigate: (page: string) => void;
    onLogout?: () => void;
}

export function BrowseBooksPage({ onNavigate, onLogout }: BrowseBooksPageProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("title");
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<Set<number>>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => {
        async function loadBooks() {
            setIsLoading(true);
            const data = await fetchBooks();
            setBooks(data);
            setIsLoading(false);
        }
        loadBooks();
    }, []);

    useEffect(() => {
        const handleFavoritesChange = () => {
            const saved = localStorage.getItem('favorites');
            setFavorites(saved ? new Set(JSON.parse(saved)) : new Set());
        };

        window.addEventListener('favoritesChanged', handleFavoritesChange);
        return () => window.removeEventListener('favoritesChanged', handleFavoritesChange);
    }, []);

    // Read search query and category from URL parameters
    useEffect(() => {
        const updateFromUrl = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const searchParam = urlParams.get('search');
            const categoryParam = urlParams.get('category');
            
            if (searchParam) {
                setSearchQuery(decodeURIComponent(searchParam));
            }
            
            if (categoryParam) {
                setSelectedCategory(decodeURIComponent(categoryParam).toLowerCase());
            }
        };

        updateFromUrl();

        // Listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', updateFromUrl);
        
        return () => {
            window.removeEventListener('popstate', updateFromUrl);
        };
    }, []);

    const toggleFavorite = (bookId: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(bookId)) {
            newFavorites.delete(bookId);
        } else {
            newFavorites.add(bookId);
        }
        // Update state and localStorage immediately
        setFavorites(newFavorites);
        const favArray = Array.from(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(favArray));
        // Dispatch event for other components to sync
        window.dispatchEvent(new Event('favoritesChanged'));
    };

    // Get unique categories from books
    const categories = useMemo(() => {
        const uniqueGenres = [...new Set(books.map((book) => book.genre))];
        return ["All", ...uniqueGenres];
    }, [books]);

    // Filter and sort books
    const filteredBooks = useMemo(() => {
        let result = [...books];

        // Filter by category
        if (selectedCategory !== "all") {
            result = result.filter((book) => book.genre.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (book) =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query) ||
                    book.genre.toLowerCase().includes(query)
            );
        }

        // Sort
        switch (sortBy) {
            case "title":
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "author":
                result.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case "stock-high":
                result.sort((a, b) => b.stockCount - a.stockCount);
                break;
            case "stock-low":
                result.sort((a, b) => a.stockCount - b.stockCount);
                break;
        }

        return result;
    }, [books, selectedCategory, sortBy, searchQuery]);

    return (
        <div className="min-h-screen bg-white">
            <Navbar currentPage="browse" onNavigate={onNavigate} onLogout={onLogout} />

            {/* Page Header */}
            <div className="bg-gradient-to-br from-blue-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-gray-900 mb-4">Browse Books</h1>
                    <p className="text-gray-600 mb-6">Explore our complete collection of books across all genres</p>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, author, or genre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-20">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <h3 className="text-gray-900">Filters</h3>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h4 className="text-gray-700 mb-3">Categories</h4>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category.toLowerCase())}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                selectedCategory === category.toLowerCase()
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Stock Filter */}
                            <div>
                                <h4 className="text-gray-700 mb-3">Availability</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded" />
                                        <span className="text-gray-600">In Stock Only</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Books Grid */}
                    <div className="flex-1">
                        {/* Sort and Results Count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">{filteredBooks.length} books found</p>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="title">Title (A-Z)</option>
                                    <option value="author">Author (A-Z)</option>
                                    <option value="stock-high">Stock: High to Low</option>
                                    <option value="stock-low">Stock: Low to High</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                <span className="ml-2 text-gray-600">Loading books...</span>
                            </div>
                        ) : filteredBooks.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No books found matching your criteria.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("all");
                                        setSearchQuery("");
                                    }}
                                    className="mt-4 text-blue-600 hover:text-blue-700"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            /* Books Grid */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredBooks.map((book) => (
                                    <div
                                        key={book.id}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="relative aspect-[3/4] bg-gray-100">
                                            <ImageWithFallback
                                                src={getBookImageUrl(book)}
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <button 
                                                onClick={() => toggleFavorite(book.id)}
                                                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                                            >
                                                <Heart 
                                                    className="w-4 h-4"
                                                    fill={favorites.has(book.id) ? "#ef4444" : "none"}
                                                    color={favorites.has(book.id) ? "#ef4444" : "#4b5563"}
                                                />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <div className="inline-block px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm mb-2">
                                                {book.genre}
                                            </div>
                                            <h3 className="text-gray-900 mb-1 font-medium">{book.title}</h3>
                                            <p className="text-gray-600 mb-2">{book.author}</p>
                                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{book.summary}</p>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`text-sm ${
                                                        book.stockCount > 0 ? "text-green-600" : "text-red-600"
                                                    }`}
                                                >
                                                    {book.stockCount > 0 ? `${book.stockCount} in stock` : "Out of stock"}
                                                </span>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={book.stockCount === 0}
                                                >
                                                    {book.stockCount > 0 ? "Borrow" : "Unavailable"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
