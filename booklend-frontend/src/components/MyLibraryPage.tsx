import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Navbar } from "./Navbar";
import { BookOpen, Heart, Trash2, Download, Loader2 } from "lucide-react";
import { fetchBooks, fetchRentals, getBookImageUrl, Book, Rental } from "../api";

interface MyLibraryPageProps {
    onNavigate: (page: string) => void;
    onLogout?: () => void;
}

export function MyLibraryPage({ onNavigate, onLogout }: MyLibraryPageProps) {
    const [activeTab, setActiveTab] = useState("reading");
    const [isLoading, setIsLoading] = useState(true);
    const [libraryBooks, setLibraryBooks] = useState<any[]>([]);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => {
        async function loadLibraryBooks() {
            setIsLoading(true);
            const [booksData, rentalsData] = await Promise.all([
                fetchBooks(),
                fetchRentals()
            ]);
            
            setAllBooks(booksData);
            
            // Map rentals to library books with book details
            const libraryItems = rentalsData.map(rental => {
                const book = booksData.find(b => b.id === rental.bookId);
                return {
                    ...book,
                    ...rental,
                    progress: rental.returned ? 100 : 50,
                    status: rental.returned ? "Completed" : "Reading"
                };
            });
            
            setLibraryBooks(libraryItems);
            setIsLoading(false);
        }
        loadLibraryBooks();
    }, []);

    // Listen for favorite changes from localStorage
    useEffect(() => {
        const handleFavoritesChange = () => {
            const saved = localStorage.getItem('favorites');
            setFavoriteIds(saved ? new Set(JSON.parse(saved)) : new Set());
        };

        window.addEventListener('favoritesChanged', handleFavoritesChange);
        // Also check periodically in case favorites changed in another tab
        const interval = setInterval(handleFavoritesChange, 1000);
        return () => {
            window.removeEventListener('favoritesChanged', handleFavoritesChange);
            clearInterval(interval);
        };
    }, []);

    const handleRemoveBook = (bookId: number, bookTitle: string) => {
        if (confirm(`Remove "${bookTitle}" from your library?`)) {
            setLibraryBooks(libraryBooks.filter(book => book.id !== bookId));
        }
    };

    const handleUpdateProgress = (bookId: number, newStatus: string, newProgress: number) => {
        setLibraryBooks(libraryBooks.map(book => 
            book.id === bookId 
                ? { ...book, status: newStatus, progress: newProgress }
                : book
        ));
    };

    // Filter books based on active tab
    const filteredBooks = (() => {
        if (activeTab === "reading") return libraryBooks.filter(book => book.status === "Reading");
        if (activeTab === "completed") return libraryBooks.filter(book => book.status === "Completed");
        if (activeTab === "favorites") {
            // Show books that are hearted, combine rentals and all books
            return allBooks
                .filter(book => favoriteIds.has(book.id))
                .map(book => ({
                    ...book,
                    isFavorite: true
                }));
        }
        return libraryBooks;
    })();

    // Dynamic stats based on library
    const readingStats = [
        { label: "Books Read", value: libraryBooks.filter(b => b.status === "Completed").length, icon: BookOpen, color: "bg-blue-100 text-blue-600" },
        { label: "Currently Reading", value: libraryBooks.filter(b => b.status === "Reading").length, icon: Heart, color: "bg-pink-100 text-pink-600" },
        { label: "Total Books", value: libraryBooks.length + favoriteIds.size, icon: Download, color: "bg-green-100 text-green-600" },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar currentPage="library" onNavigate={onNavigate} onLogout={onLogout} />

            <div className="bg-gradient-to-br from-blue-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-gray-900 mb-2">My Library</h1>
                    <p className="text-gray-600">Track your reading journey and manage your book collection</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {readingStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                                <div
                                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab("reading")}
                        className={`px-4 py-3 border-b-2 ${activeTab === "reading" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}
                    >
                        Currently Reading
                    </button>
                    <button 
                        onClick={() => setActiveTab("completed")}
                        className={`px-4 py-3 border-b-2 ${activeTab === "completed" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}
                    >
                        Completed
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab("favorites")}
                        className={`px-4 py-3 border-b-2 ${activeTab === "favorites" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}
                    >
                        Favorites
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading your library...</span>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No books in this category yet.</p>
                        <button 
                            onClick={() => onNavigate("browse")}
                            className="mt-4 text-blue-600 hover:text-blue-700"
                        >
                            Browse books to add to your library
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBooks.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                    <ImageWithFallback
                                        src={getBookImageUrl(book)}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-gray-900 mb-1">{book.title}</h3>
                                            <p className="text-gray-600">{book.author}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                book.status === "Reading"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : book.status === "Completed"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {book.status}
                                        </span>
                                    </div>

                                    {book.progress > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-600">Reading Progress</span>
                                                <span className="text-gray-900">{book.progress}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full transition-all"
                                                    style={{ width: `${book.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-3">
                                        {book.status === "Reading" && (
                                            <button 
                                                onClick={() => handleUpdateProgress(book.id, "Reading", Math.min(book.progress + 10, 100))}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Continue Reading
                                            </button>
                                        )}
                                        {book.status === "Completed" && (
                                            <button 
                                                onClick={() => handleUpdateProgress(book.id, "Reading", 0)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Read Again
                                            </button>
                                        )}
                                        {book.status === "Want to Read" && (
                                            <button 
                                                onClick={() => handleUpdateProgress(book.id, "Reading", 0)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Start Reading
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = book.image;
                                                link.download = `${book.title}.jpg`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const newFavorites = new Set(favoriteIds);
                                                if (newFavorites.has(book.id)) {
                                                    newFavorites.delete(book.id);
                                                } else {
                                                    newFavorites.add(book.id);
                                                }
                                                setFavoriteIds(newFavorites);
                                                localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <Heart className={`w-4 h-4 ${favoriteIds.has(book.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                            {favoriteIds.has(book.id) ? 'Unfavorite' : 'Favorite'}
                                        </button>
                                        {!book.isFavorite && (
                                            <button 
                                                onClick={() => handleRemoveBook(book.id, book.title)}
                                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
}
