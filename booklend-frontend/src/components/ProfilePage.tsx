import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { User, Mail, Calendar, BookOpen, Edit2 } from "lucide-react";

import { fetchRentals, fetchCurrentUser } from "../api";

interface ProfilePageProps {
    onNavigate: (page: string) => void;
    onLogout?: () => void;
}

export function ProfilePage({ onNavigate, onLogout }: ProfilePageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        joinDate: "January 15, 2025",
        bio: "Book enthusiast and avid reader",
        memberType: "Premium",
    });

    const [formData, setFormData] = useState(profile);
    const [stats, setStats] = useState({
        booksRead: 0,
        currentlyReading: 0,
        favorites: 0,
    });

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const currentUser = await fetchCurrentUser();
                if (currentUser) {
                    const name = [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ");
                    const userData = {
                        name: name || currentUser.email,
                        email: currentUser.email,
                        joinDate: "",
                        bio: "",
                        memberType: currentUser.role === "ADMIN" ? "Admin" : "Member",
                    };
                    setProfile(userData);
                    setFormData(userData);
                }

                const rentals = await fetchRentals();
                const booksRead = rentals.filter(r => r.returned).length;
                const currentlyReading = rentals.filter(r => !r.returned).length;

                const favoritesStr = localStorage.getItem("favorites");
                const favorites = favoritesStr ? JSON.parse(favoritesStr).length : 0;

                setStats({
                    booksRead,
                    currentlyReading,
                    favorites,
                });
            } catch (error) {
                console.error("Failed to load user data:", error);
            }
        };

        loadUserData();

        // Listen for favorites changes
        const handleFavoritesChange = (event: Event) => {
            const customEvent = event as CustomEvent;
            const newFavorites = customEvent.detail?.favorites || [];
            setStats(prev => ({
                ...prev,
                favorites: newFavorites.length,
            }));
        };

        window.addEventListener("favoritesChanged", handleFavoritesChange);
        return () => window.removeEventListener("favoritesChanged", handleFavoritesChange);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setProfile(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar currentPage="profile" onNavigate={onNavigate} onLogout={onLogout} />

            <div className="bg-gradient-to-br from-blue-50 to-white py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account information</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-8">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-gray-900 text-center mb-1">{profile.name}</h2>
                                <p className="text-blue-600 text-sm font-medium">{profile.memberType}</p>
                                <p className="text-gray-600 text-sm text-center mt-4">{profile.bio}</p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-gray-900">Account Information</h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {isEditing ? "Cancel" : "Edit"}
                                </button>
                            </div>

                            {!isEditing ? (
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Full Name
                                        </label>
                                        <p className="text-gray-900">{profile.name}</p>
                                    </div>

                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email Address
                                        </label>
                                        <p className="text-gray-900">{profile.email}</p>
                                    </div>

                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Member Since
                                        </label>
                                        <p className="text-gray-900">{profile.joinDate}</p>
                                    </div>

                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" />
                                            Bio
                                        </label>
                                        <p className="text-gray-900">{profile.bio}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 block">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 block">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 block">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                                    <div className="text-blue-600 text-2xl font-bold mb-1">{stats.booksRead}</div>
                                <div className="text-gray-600 text-sm">Books Read</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                                    <div className="text-green-600 text-2xl font-bold mb-1">{stats.currentlyReading}</div>
                                <div className="text-gray-600 text-sm">Currently Reading</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                                    <div className="text-purple-600 text-2xl font-bold mb-1">{stats.favorites}</div>
                                <div className="text-gray-600 text-sm">Favorites</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
