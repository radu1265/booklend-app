import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Navbar } from "./Navbar";
import { Search, Star, TrendingUp, Heart, BookMarked, Compass, Sparkles, User, BookOpen, Loader2 } from "lucide-react";
import { fetchBooks, getBookImageUrl, Book } from "../api";

interface HomePageProps {
    onNavigate: (page: string) => void;
    onLogout?: () => void;
}

export function HomePage({ onNavigate, onLogout }: HomePageProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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

    const handleSearch = () => {
        if (searchQuery.trim()) {
            window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
        } else {
            window.location.href = '/browse';
        }
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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

    // Create dynamic categories from unique genres in the database
    const categories = (() => {
        const uniqueGenres = [...new Set(books.map(b => b.genre))].slice(0, 8);
        
        const getIconForGenre = (genre: string): any => {
            const lowerGenre = genre.toLowerCase();
            if (lowerGenre.includes('fiction') && !lowerGenre.includes('science')) return BookOpen;
            if (lowerGenre.includes('fantasy') || lowerGenre.includes('magic')) return Sparkles;
            if (lowerGenre.includes('romance') || lowerGenre.includes('love')) return Heart;
            if (lowerGenre.includes('dystopian') || lowerGenre.includes('apocalyptic')) return Compass;
            if (lowerGenre.includes('biography') || lowerGenre.includes('memoir')) return User;
            if (lowerGenre.includes('self-help') || lowerGenre.includes('personal')) return TrendingUp;
            if (lowerGenre.includes('history') || lowerGenre.includes('historical')) return BookMarked;
            if (lowerGenre.includes('science') || lowerGenre.includes('technology')) return Sparkles;
            return BookOpen;
        };

        const getColorForGenre = (genre: string): string => {
            const lowerGenre = genre.toLowerCase();
            if (lowerGenre.includes('fiction') && !lowerGenre.includes('science')) return "bg-blue-100 text-blue-600";
            if (lowerGenre.includes('fantasy') || lowerGenre.includes('magic')) return "bg-indigo-100 text-indigo-600";
            if (lowerGenre.includes('romance') || lowerGenre.includes('love')) return "bg-pink-100 text-pink-600";
            if (lowerGenre.includes('dystopian') || lowerGenre.includes('apocalyptic')) return "bg-purple-100 text-purple-600";
            if (lowerGenre.includes('biography') || lowerGenre.includes('memoir')) return "bg-yellow-100 text-yellow-600";
            if (lowerGenre.includes('self-help') || lowerGenre.includes('personal')) return "bg-orange-100 text-orange-600";
            if (lowerGenre.includes('history') || lowerGenre.includes('historical')) return "bg-red-100 text-red-600";
            if (lowerGenre.includes('science') || lowerGenre.includes('technology')) return "bg-green-100 text-green-600";
            return "bg-blue-100 text-blue-600";
        };

        return uniqueGenres.map(genre => ({
            name: genre,
            icon: getIconForGenre(genre),
            color: getColorForGenre(genre),
            count: `${books.filter(b => b.genre === genre).length} books`
        }));
    })();

    // Get featured books (first 4)
    const featuredBooks = books.slice(0, 4);

    return (
        <div className="min-h-screen bg-white">
            <Navbar currentPage="home" onNavigate={onNavigate} onLogout={onLogout} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-white py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-gray-900 mb-4">Discover Your Next Great Read</h1>
                        <p className="text-gray-600 mb-8">
                            Explore thousands of books across all genres. From bestsellers to hidden gems, find your
                            perfect book in our ever-growing collection.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for books, authors, or ISBN..."
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleSearchKeyPress}
                                />
                                <button 
                                    onClick={handleSearch}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12 max-w-xl mx-auto">
                            <div>
                                <div className="text-blue-600 mb-1">{books.length}+</div>
                                <div className="text-gray-600">Books</div>
                            </div>
                            <div>
                                <div className="text-blue-600 mb-1">{Math.ceil(books.reduce((sum, b) => sum + b.stockCount, 0) / 10)}+</div>
                                <div className="text-gray-600">Readers</div>
                            </div>
                            <div>
                                <div className="text-blue-600 mb-1">{[...new Set(books.map(b => b.author))].length}+</div>
                                <div className="text-gray-600">Authors</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Books Section */}
            <section className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-gray-900 mb-2">Featured Books</h2>
                            <p className="text-gray-600">Handpicked selections just for you</p>
                        </div>
                        <button 
                            onClick={() => onNavigate("browse")}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            View All
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading books...</span>
                        </div>
                    ) : featuredBooks.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No books available yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredBooks.map((book) => (
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
                                        <p className="text-gray-600 mb-3">{book.author}</p>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`text-sm ${book.stockCount > 0 ? "text-green-600" : "text-red-600"}`}>
                                                {book.stockCount > 0 ? `${book.stockCount} in stock` : "Out of stock"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button 
                                                onClick={() => onNavigate("browse")}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            </section>

            {/* Categories Section */}
            <section className="py-16 sm:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-gray-900 mb-2">Browse by Category</h2>
                        <p className="text-gray-600">Find books in your favorite genres</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => onNavigate("browse")}
                                    className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-left"
                                >
                                    <div
                                        className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-3`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-gray-900 mb-1">{category.name}</h3>
                                    <p className="text-gray-500">{category.count}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-center">
                        <h2 className="text-white mb-4">Start Your Reading Journey Today</h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of readers who have discovered their favorite books on Booklend. Get
                            personalized recommendations and exclusive deals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => onNavigate("browse")}
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Browse Books
                            </button>
                            <button className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* About */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white">Booklend</span>
                            </div>
                            <p className="text-gray-400">
                                Your destination for discovering and reading amazing books from around the world.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-white mb-4">Categories</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Fiction
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Non-Fiction
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Children's Books
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Educational
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-white mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        FAQs
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-gray-400">© 2025 Booklend. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 sm:mt-0">
                            <a href="#" className="hover:text-white transition-colors">
                                Twitter
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                Facebook
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                Instagram
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
