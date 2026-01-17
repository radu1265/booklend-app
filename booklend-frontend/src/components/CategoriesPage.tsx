import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { fetchBooks } from "../api";
import {
    BookOpen,
    Heart,
    Compass,
    Sparkles,
    User,
    TrendingUp,
    BookMarked,
    Lightbulb,
    Briefcase,
    GraduationCap,
    Music,
    Plane,
    Utensils,
    Palette,
    Scale,
    Activity,
} from "lucide-react";

interface CategoriesPageProps {
    onNavigate: (page: string) => void;
    onLogout?: () => void;
}

export function CategoriesPage({ onNavigate, onLogout }: CategoriesPageProps) {
    const [books, setBooks] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        async function loadBooks() {
            const data = await fetchBooks();
            setBooks(data);

            // Get unique genres and count books per genre
            const genreCounts: Record<string, number> = {};
            data.forEach((book) => {
                genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
            });

            // Icon mapping with smart matching for genre names
            const getIconForGenre = (genre: string): any => {
                const lowerGenre = genre.toLowerCase();
                
                if (lowerGenre.includes('fiction') && !lowerGenre.includes('science')) return BookOpen;
                if (lowerGenre.includes('fantasy') || lowerGenre.includes('magic')) return Sparkles;
                if (lowerGenre.includes('romance') || lowerGenre.includes('love')) return Heart;
                if (lowerGenre.includes('mystery') || lowerGenre.includes('thriller')) return Compass;
                if (lowerGenre.includes('science') || lowerGenre.includes('technology')) return Sparkles;
                if (lowerGenre.includes('biography') || lowerGenre.includes('memoir')) return User;
                if (lowerGenre.includes('history') || lowerGenre.includes('historical')) return BookMarked;
                if (lowerGenre.includes('philosophy')) return Lightbulb;
                if (lowerGenre.includes('business') || lowerGenre.includes('economics')) return Briefcase;
                if (lowerGenre.includes('education') || lowerGenre.includes('reference')) return GraduationCap;
                if (lowerGenre.includes('music') || lowerGenre.includes('arts')) return Music;
                if (lowerGenre.includes('travel') || lowerGenre.includes('adventure')) return Plane;
                if (lowerGenre.includes('cooking') || lowerGenre.includes('food')) return Utensils;
                if (lowerGenre.includes('art') || lowerGenre.includes('design')) return Palette;
                if (lowerGenre.includes('law') || lowerGenre.includes('politics')) return Scale;
                if (lowerGenre.includes('health') || lowerGenre.includes('wellness')) return Activity;
                if (lowerGenre.includes('dystopian') || lowerGenre.includes('apocalyptic')) return BookMarked;
                if (lowerGenre.includes('horror') || lowerGenre.includes('terror')) return Compass;
                if (lowerGenre.includes('psychological')) return Lightbulb;
                
                return BookOpen; // Default icon
            };

            // Color mapping with smart matching
            const getColorForGenre = (genre: string): string => {
                const lowerGenre = genre.toLowerCase();
                
                if (lowerGenre.includes('fiction') && !lowerGenre.includes('science')) return "bg-blue-100 text-blue-600 border-blue-200";
                if (lowerGenre.includes('fantasy') || lowerGenre.includes('magic')) return "bg-indigo-100 text-indigo-600 border-indigo-200";
                if (lowerGenre.includes('romance') || lowerGenre.includes('love')) return "bg-pink-100 text-pink-600 border-pink-200";
                if (lowerGenre.includes('mystery') || lowerGenre.includes('thriller')) return "bg-purple-100 text-purple-600 border-purple-200";
                if (lowerGenre.includes('science') || lowerGenre.includes('technology')) return "bg-green-100 text-green-600 border-green-200";
                if (lowerGenre.includes('biography') || lowerGenre.includes('memoir')) return "bg-yellow-100 text-yellow-600 border-yellow-200";
                if (lowerGenre.includes('history') || lowerGenre.includes('historical')) return "bg-red-100 text-red-600 border-red-200";
                if (lowerGenre.includes('philosophy')) return "bg-cyan-100 text-cyan-600 border-cyan-200";
                if (lowerGenre.includes('business') || lowerGenre.includes('economics')) return "bg-teal-100 text-teal-600 border-teal-200";
                if (lowerGenre.includes('education') || lowerGenre.includes('reference')) return "bg-lime-100 text-lime-600 border-lime-200";
                if (lowerGenre.includes('music') || lowerGenre.includes('arts')) return "bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200";
                if (lowerGenre.includes('travel') || lowerGenre.includes('adventure')) return "bg-sky-100 text-sky-600 border-sky-200";
                if (lowerGenre.includes('cooking') || lowerGenre.includes('food')) return "bg-amber-100 text-amber-600 border-amber-200";
                if (lowerGenre.includes('art') || lowerGenre.includes('design')) return "bg-rose-100 text-rose-600 border-rose-200";
                if (lowerGenre.includes('law') || lowerGenre.includes('politics')) return "bg-slate-100 text-slate-600 border-slate-200";
                if (lowerGenre.includes('health') || lowerGenre.includes('wellness')) return "bg-emerald-100 text-emerald-600 border-emerald-200";
                if (lowerGenre.includes('dystopian') || lowerGenre.includes('apocalyptic')) return "bg-gray-100 text-gray-600 border-gray-200";
                if (lowerGenre.includes('horror') || lowerGenre.includes('terror')) return "bg-red-100 text-red-600 border-red-200";
                if (lowerGenre.includes('psychological')) return "bg-purple-100 text-purple-600 border-purple-200";
                
                return "bg-blue-100 text-blue-600 border-blue-200"; // Default color
            };

            const categoryList = Object.entries(genreCounts).map(([genre, count]) => ({
                name: genre,
                icon: getIconForGenre(genre),
                color: getColorForGenre(genre),
                count: `${count} book${count !== 1 ? "s" : ""}`,
                description: `Discover ${genre.toLowerCase()} books`,
            }));

            setCategories(categoryList);
        }
        loadBooks();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar currentPage="categories" onNavigate={onNavigate} onLogout={onLogout} />

            {/* Page Header */}
            <div className="bg-gradient-to-br from-blue-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-gray-900 mb-2">Browse Categories</h1>
                    <p className="text-gray-600">Discover books across all genres and topics</p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Featured Categories */}
                <div className="mb-12">
                    <h2 className="text-gray-900 mb-6">Popular Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.slice(0, 4).map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        window.location.href = `/browse?category=${encodeURIComponent(category.name)}`;
                                    }}
                                    className={`${category.color} border p-6 rounded-xl hover:shadow-md transition-shadow text-left group`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className={`w-14 h-14 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                                        >
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="text-sm opacity-75">{category.count}</span>
                                    </div>
                                    <h3 className="text-gray-900 mb-2">{category.name}</h3>
                                    <p className="text-sm opacity-75">{category.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* All Categories */}
                <div>
                    <h2 className="text-gray-900 mb-6">All Categories</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        window.location.href = `/browse?category=${encodeURIComponent(category.name)}`;
                                    }}
                                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow text-left group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-gray-900 mb-1 truncate">{category.name}</h3>
                                            <p className="text-gray-500 text-sm">{category.count}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-center">
                    <h2 className="text-white mb-4">Can't Find What You're Looking For?</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Use our advanced search to find books by title, author, ISBN, or keywords
                    </p>
                    <button
                        onClick={() => onNavigate("browse")}
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Advanced Search
                    </button>
                </div>
            </div>
        </div>
    );
}
