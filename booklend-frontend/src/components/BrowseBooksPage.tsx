import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, Filter, Heart, ChevronDown, Loader2, BookOpen, Pencil, Trash2 } from "lucide-react";
import { Navbar } from "./Navbar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { fetchBooks, getBookImageUrl, Book, borrowBook, createBook, updateBook, deleteBook as apiDeleteBook } from "../api";
import { getToken } from "../auth";

interface BrowseBooksPageProps {
    onNavigate: (page: string) => void;
    onLogout?: () => void;
    isAdmin?: boolean; 
}

export function BrowseBooksPage({ onNavigate, onLogout, isAdmin = false }: BrowseBooksPageProps) {
        const [showEditModal, setShowEditModal] = useState(false);
        const [editBook, setEditBook] = useState<Book | null>(null);
        const [showCreateModal, setShowCreateModal] = useState(false);

        const [showDeleteModal, setShowDeleteModal] = useState(false);
        const [deleteBook, setDeleteBook] = useState<Book | null>(null);


        const handleDelete = (bookId: number) => {
            const book = books.find(b => b.id === bookId) || null;
            setDeleteBook(book);
            setShowDeleteModal(true);
        };

        const confirmDelete = async () => {
            if (!deleteBook) return;
            const result = await apiDeleteBook(deleteBook.id);
            if (result.success) {
                setBooks(prev => prev.filter(b => b.id !== deleteBook.id));
            } else {
                alert(result.message || "Failed to delete book");
            }
            setShowDeleteModal(false);
            setDeleteBook(null);
        };

        const handleEdit = (book: Book) => {
            setEditBook(book);
            setShowEditModal(true);
        };

        const handleCreate = () => {
            setShowCreateModal(true);
        };

        const [formState, setFormState] = useState({
            title: '',
            author: '',
            genre: '',
            summary: '',
            stockCount: 1,
        });
        const [createImageFile, setCreateImageFile] = useState<File | undefined>(undefined);
        const [createImagePreview, setCreateImagePreview] = useState<string | undefined>(undefined);
        const [createImageError, setCreateImageError] = useState<string | undefined>(undefined);
        const [createImageFailed, setCreateImageFailed] = useState<boolean>(false);
        const fileInputRef = useRef<HTMLInputElement | null>(null);

        useEffect(() => {
            if (showCreateModal) {
                setFormState({ title: '', author: '', genre: '', summary: '', stockCount: 1 });
                setCreateImageFile(undefined);
                setCreateImagePreview(undefined);
                setCreateImageFailed(false);
            }
        }, [showCreateModal]);
        useEffect(() => {
            if (showEditModal && editBook) {
                setFormState({
                    title: editBook.title,
                    author: editBook.author,
                    genre: editBook.genre || '',
                    summary: editBook.summary || '',
                    stockCount: editBook.stockCount || 1,
                });
            }
        }, [showEditModal, editBook]);

        const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormState(prev => ({ ...prev, [name]: name === 'stockCount' ? Number(value) : value }));
        };


        const submitCreate = async (e: React.FormEvent) => {
            e.preventDefault();
            const result = await createBook(formState, createImageFile);
            if (result.success && result.book) {
                setBooks(prev => [result.book, ...prev]);
                setShowCreateModal(false);
                setCreateImageFile(undefined);
            } else {
                alert(result.message || "Failed to create book");
            }
        };


        const submitEdit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!editBook) return;
            const result = await updateBook(editBook.id, formState);
            if (result.success && result.book) {
                setBooks(prev => prev.map(b => b.id === editBook.id ? result.book! : b));
                setShowEditModal(false);
                setEditBook(null);
            } else {
                alert(result.message || "Failed to update book");
            }
        };

        const renderEditModal = () => {
            if (!showEditModal || !editBook) return null;
            return createPortal(
                <div style={{ position: "fixed", inset: 0, zIndex: 30000, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { setShowEditModal(false); setEditBook(null); }}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 320, width: 400 }} onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Update Book</h2>
                        <form onSubmit={submitEdit} className="space-y-3">
                            <input name="title" value={formState.title} onChange={handleFormChange} placeholder="Title" required className="w-full border rounded px-3 py-2" />
                            <input name="author" value={formState.author} onChange={handleFormChange} placeholder="Author" required className="w-full border rounded px-3 py-2" />
                            <input name="genre" value={formState.genre} onChange={handleFormChange} placeholder="Genre" className="w-full border rounded px-3 py-2" />
                            <textarea name="summary" value={formState.summary} onChange={handleFormChange} placeholder="Summary" className="w-full border rounded px-3 py-2" />
                            <input name="stockCount" type="number" min={0} value={formState.stockCount} onChange={handleFormChange} placeholder="Stock" required className="w-full border rounded px-3 py-2" />
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" className="px-4 py-2 rounded border" onClick={() => { setShowEditModal(false); setEditBook(null); }}>Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            );
        };

        const renderCreateModal = () => {
            if (!showCreateModal) return null;
            return createPortal(
                <div style={{ position: "fixed", inset: 0, zIndex: 30000, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowCreateModal(false)}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 320, width: 400 }} onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Create Book</h2>
                        <form onSubmit={submitCreate} className="space-y-3">
                            <input name="title" value={formState.title} onChange={handleFormChange} placeholder="Title" required className="w-full border rounded px-3 py-2" />
                            <input name="author" value={formState.author} onChange={handleFormChange} placeholder="Author" required className="w-full border rounded px-3 py-2" />
                            <input name="genre" value={formState.genre} onChange={handleFormChange} placeholder="Genre" className="w-full border rounded px-3 py-2" />
                            <textarea name="summary" value={formState.summary} onChange={handleFormChange} placeholder="Summary" className="w-full border rounded px-3 py-2" />
                            <input name="stockCount" type="number" min={0} value={formState.stockCount} onChange={handleFormChange} placeholder="Stock" required className="w-full border rounded px-3 py-2" />
                            <div className="space-y-2">
                                <label className="text-sm text-gray-700">Cover image (optional)</label>
                                <input
                                    ref={(el) => (fileInputRef.current = el)}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files && e.target.files[0];
                                        if (f) {
                                            if (!f.type || !f.type.startsWith("image/")) {
                                                setCreateImageFile(undefined);
                                                setCreateImagePreview(undefined);
                                                setCreateImageError(`Selected file is not an image (type: ${f.type || 'unknown'})`);
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                            } else {
                                                setCreateImageError(undefined);
                                                setCreateImageFile(f);
                                                setCreateImageFailed(false);
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    const res = reader.result as string;
                                                    if (!res.startsWith("data:image/")) {
                                                        setCreateImagePreview(undefined);
                                                        setCreateImageError('Selected file content is not an image');
                                                        setCreateImageFile(undefined);
                                                        setCreateImageFailed(true);
                                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                                    } else {
                                                        setCreateImagePreview(res);
                                                        setCreateImageFailed(false);
                                                    }
                                                };
                                                reader.onerror = () => {
                                                    setCreateImagePreview(undefined);
                                                    setCreateImageError('Failed to read file for preview');
                                                };
                                                reader.readAsDataURL(f);
                                            }
                                        } else {
                                            setCreateImageFile(undefined);
                                            setCreateImagePreview(undefined);
                                            setCreateImageError(undefined);
                                        }
                                    }}
                                    className="hidden"
                                />

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 7v13a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4"/></svg>
                                        <span className="text-sm text-gray-700">Choose cover image</span>
                                    </button>
                                    {createImageFile && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCreateImageFile(undefined);
                                                setCreateImagePreview(undefined);
                                                setCreateImageFailed(false);
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                            }}
                                            className="px-2 py-1 border rounded text-sm text-gray-600 hover:bg-gray-100"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {createImagePreview && !createImageError && !createImageFailed && (
                                    <div className="mt-2 w-32 h-40 rounded overflow-hidden border border-gray-200">
                                        <img src={createImagePreview} alt="preview" className="w-full h-full object-cover" onError={() => setCreateImageFailed(true)} />
                                    </div>
                                )}
                                {createImagePreview && (createImageError || createImageFailed) && (
                                    <div className="mt-2 w-32 h-40 rounded overflow-hidden border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                                        Preview unavailable
                                    </div>
                                )}
                                {createImageError && (
                                    <div className="mt-2 text-sm text-red-600">{createImageError}</div>
                                )}
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" className="px-4 py-2 rounded border" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Create</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            );
        };

        const renderDeleteModal = () => {
            if (!showDeleteModal || !deleteBook) return null;
            return createPortal(
                <div style={{ position: "fixed", inset: 0, zIndex: 30000, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { setShowDeleteModal(false); setDeleteBook(null); }}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 320, width: 400 }} onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4 text-red-600">Delete Book</h2>
                        <p>Are you sure you want to delete <b>{deleteBook.title}</b> by {deleteBook.author}?</p>
                        <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
                            <button
                                type="button"
                                className="px-4 py-2 rounded border w-full sm:w-auto"
                                onClick={() => { setShowDeleteModal(false); setDeleteBook(null); }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                aria-label="Confirm delete"
                                className="px-4 py-2 rounded w-full sm:w-auto flex items-center justify-center"
                                style={{ backgroundColor: '#dc2626', color: '#ffffff', boxShadow: '0 6px 18px rgba(220,38,38,0.18)', fontWeight: 600 }}
                            >
                                <Trash2 className="w-4 h-4 mr-2 text-white" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            );
        };
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("title");
    const [searchQuery, setSearchQuery] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [borrowingBookId, setBorrowingBookId] = useState<number | null>(null);
    const [borrowMessage, setBorrowMessage] = useState<{ bookId: number; message: string; isError: boolean } | null>(null);
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [borrowDays, setBorrowDays] = useState(14);
    const [borrowDueDate, setBorrowDueDate] = useState("");
    const [requiresLogin, setRequiresLogin] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9); 
    useEffect(() => {
        async function loadBooks() {
            const data = await fetchBooks();
            setBooks(data);
            setIsLoading(false);
        }
        loadBooks();
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("favorites");
        if (saved) {
            try {
                const parsed: number[] = JSON.parse(saved);
                setFavorites(new Set(parsed));
            } catch {
                setFavorites(new Set());
            }
        }
    }, []);

    useEffect(() => () => {
        document.body.style.overflow = "";
    }, []);

    useEffect(() => {
        if (!showBorrowModal) return;
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [showBorrowModal]);

    const closeModal = () => {
        setShowBorrowModal(false);
        setSelectedBook(null);
        document.body.style.overflow = "";
    };

    const toggleFavorite = (bookId: number) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(bookId)) {
                next.delete(bookId);
            } else {
                next.add(bookId);
            }
            const arrayValue = Array.from(next);
            localStorage.setItem("favorites", JSON.stringify(arrayValue));
            window.dispatchEvent(new Event("favoritesChanged"));
            return next;
        });
    };

    const startBorrow = (book: Book) => {
        const token = getToken();
        setSelectedBook(book);
        setBorrowDays(14);
        setBorrowDueDate("");
        setRequiresLogin(!token);
        setShowBorrowModal(true);
        document.body.style.overflow = "hidden";
    };

    const confirmBorrow = async () => {
        if (!selectedBook) return;
        if (requiresLogin) {
            closeModal();
            onNavigate("login");
            return;
        }

        setBorrowingBookId(selectedBook.id);
        setBorrowMessage(null);

        const result = await borrowBook({
            bookId: selectedBook.id,
            days: borrowDueDate ? undefined : borrowDays,
            dueDate: borrowDueDate || undefined,
        });

        if (result.success) {
            setBooks((prevBooks) =>
                prevBooks.map((book) =>
                    book.id === selectedBook.id
                        ? {
                              ...book,
                              stockCount: Math.max(0, (book.stockCount || 0) - 1),
                              borrowedCount: (book.borrowedCount ?? 0) + 1,
                          }
                        : book
                )
            );
            setBorrowMessage({ bookId: selectedBook.id, message: result.message, isError: false });
            setTimeout(() => setBorrowMessage(null), 3000);
            closeModal();
        } else {
            setBorrowMessage({ bookId: selectedBook.id, message: result.message, isError: true });
            setTimeout(() => setBorrowMessage(null), 5000);
        }

        setBorrowingBookId(null);
    };

    const categories = useMemo(() => {
        const uniqueGenres = [...new Set(books.map((book) => book.genre || "General"))];
        return ["All", ...uniqueGenres];
    }, [books]);

    const filteredBooks = useMemo(() => {
        let result = [...books];

        if (selectedCategory !== "all") {
            result = result.filter((book) => (book.genre || "General").toLowerCase() === selectedCategory.toLowerCase());
        }

        if (inStockOnly) {
            result = result.filter((book) => book.stockCount > 0);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (book) =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query) ||
                    (book.genre || "").toLowerCase().includes(query)
            );
        }

        switch (sortBy) {
            case "author":
                result.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case "stock-high":
                result.sort((a, b) => b.stockCount - a.stockCount);
                break;
            case "stock-low":
                result.sort((a, b) => a.stockCount - b.stockCount);
                break;
            case "title":
            default:
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        return result;
    }, [books, selectedCategory, sortBy, searchQuery, inStockOnly]);

    const totalPages = Math.ceil(filteredBooks.length / pageSize);
    const paginatedBooks = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredBooks.slice(start, start + pageSize);
    }, [filteredBooks, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, sortBy, searchQuery, inStockOnly, pageSize]);

    const renderBorrowModal = () => {
        if (!showBorrowModal || !selectedBook) return null;
        const book = selectedBook;

        return createPortal(
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 20000,
                    background: "linear-gradient(120deg, rgba(12,20,53,0.82) 0%, rgba(9,12,30,0.86) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "18px",
                    backdropFilter: "blur(2px)",
                }}
                onClick={closeModal}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "760px",
                        background: "linear-gradient(135deg, #ffffff 0%, #f7fbff 40%, #f0f4ff 100%)",
                        borderRadius: "20px",
                        boxShadow: "0 28px 90px rgba(0,0,0,0.32)",
                        padding: "28px",
                        animation: "fadeIn 160ms ease-out",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md border border-gray-100 bg-gray-100 flex-shrink-0">
                                <ImageWithFallback src={getBookImageUrl(book)} alt={book.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                                    Borrow
                                </div>
                                <h3 className="text-gray-900 text-xl font-semibold leading-tight">{book.title}</h3>
                                <p className="text-gray-600 text-sm">by {book.author}</p>
                                <div className="flex flex-wrap gap-2 mt-1 text-xs">
                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">{book.genre || "General"}</span>
                                    <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Stock: {book.stockCount}</span>
                                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">Borrowed: {book.borrowedCount ?? 0}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>

                    {requiresLogin ? (
                        <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-sm text-yellow-800 flex items-center justify-between mb-4">
                            <span>Please log in to borrow this book.</span>
                            <button
                                onClick={() => {
                                    closeModal();
                                    onNavigate("login");
                                }}
                                className="px-3 py-1 rounded-md bg-yellow-500 text-white text-xs hover:bg-yellow-600"
                            >
                                Go to login
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4 mb-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700">Select borrow duration</p>
                            </div>
                            <div className="flex gap-2">
                                {[7, 14, 21].map((days) => (
                                    <button
                                        key={days}
                                        onClick={() => {
                                            setBorrowDays(days);
                                            setBorrowDueDate("");
                                        }}
                                        className={`px-3 py-2 rounded-lg border text-sm ${
                                            borrowDueDate === "" && borrowDays === days
                                                ? "border-blue-600 text-blue-600 bg-blue-50"
                                                : "border-gray-200 text-gray-700 bg-white"
                                        }`}
                                    >
                                        {days} days
                                    </button>
                                ))}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-700" htmlFor="dueDate">
                                    Or pick a due date
                                </label>
                                <input
                                    id="dueDate"
                                    type="date"
                                    value={borrowDueDate}
                                    onChange={(e) => setBorrowDueDate(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500">Leave blank to use the selected days.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-1 ">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmBorrow}
                            disabled={borrowingBookId === book.id}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                requiresLogin
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            } disabled:opacity-50`}
                        >
                            {requiresLogin
                                ? "Log in to borrow"
                                : borrowingBookId === book.id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : "Confirm Borrow"}
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(6px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
            <div className="min-h-screen bg-white">
                <Navbar currentPage="browse" onNavigate={onNavigate} onLogout={onLogout} />

                <div className="bg-gradient-to-br from-blue-50 to-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-gray-900 mb-4">Browse Books</h1>
                        <p className="text-gray-600 mb-6">Explore our complete collection of books across all genres</p>

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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-20">
                                <div className="flex items-center gap-2 mb-4">
                                    <Filter className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-gray-900">Filters</h3>
                                </div>

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

                                <div>
                                    <h4 className="text-gray-700 mb-3">Availability</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                                checked={inStockOnly}
                                                onChange={(e) => setInStockOnly(e.target.checked)}
                                            />
                                            <span className="text-gray-600">In Stock Only</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
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

                            {/* Admin Create Button */}
                            {isAdmin && (
                                <div className="flex justify-end mb-4">
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        onClick={handleCreate}
                                    >
                                        + Create Book
                                    </button>
                                </div>
                            )}
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
                                            setInStockOnly(false);
                                        }}
                                        className="mt-4 text-blue-600 hover:text-blue-700"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {paginatedBooks.map((book) => (
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
                                                    <div className="absolute top-3 right-3 flex gap-2 z-60">
                                                        <button
                                                            onClick={() => toggleFavorite(book.id)}
                                                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                                                            aria-label="Toggle favorite"
                                                        >
                                                            <Heart
                                                                className="w-4 h-4"
                                                                fill={favorites.has(book.id) ? "#ef4444" : "none"}
                                                                color={favorites.has(book.id) ? "#ef4444" : "#4b5563"}
                                                            />
                                                        </button>
                                                        {isAdmin && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEdit(book)}
                                                                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-yellow-100 transition-colors shadow-sm border border-gray-200"
                                                                    aria-label="Edit book"
                                                                >
                                                                    <Pencil className="w-4 h-4 text-yellow-600" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(book.id)}
                                                                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm border border-gray-200"
                                                                    aria-label="Delete book"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="inline-block px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm mb-2">
                                                        {book.genre || "General"}
                                                    </div>
                                                    <h3 className="text-gray-900 mb-1 font-medium">{book.title}</h3>
                                                    <p className="text-gray-600 mb-2">{book.author}</p>
                                                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{book.summary}</p>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center justify-between">
                                                            <span
                                                                className={`text-sm ${
                                                                    book.stockCount > 0 ? "text-green-600" : "text-red-600"
                                                                }`}
                                                            >
                                                                {book.stockCount > 0 ? `${book.stockCount} in stock` : "Out of stock"}
                                                            </span>
                                                            <button
                                                                onClick={() => startBorrow(book)}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                                disabled={book.stockCount === 0 || borrowingBookId === book.id}
                                                            >
                                                                {borrowingBookId === book.id ? (
                                                                    <>
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                        Borrowing...
                                                                    </>
                                                                ) : book.stockCount > 0 ? (
                                                                    "Borrow"
                                                                ) : (
                                                                    "Unavailable"
                                                                )}
                                                            </button>
                                                        </div>
                                                        {/* Admin edit/delete buttons moved to top right */}
                                                        {borrowMessage && borrowMessage.bookId === book.id && (
                                                            <div
                                                                className={`text-sm px-2 py-1 rounded ${
                                                                    borrowMessage.isError
                                                                        ? "bg-red-50 text-red-600"
                                                                        : "bg-green-50 text-green-600"
                                                                }`}
                                                            >
                                                                {borrowMessage.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Pagination Controls */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Page size:</span>
                                            <select
                                                value={pageSize}
                                                onChange={e => setPageSize(Number(e.target.value))}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                            >
                                                {[6, 9, 12, 18, 24].map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-sm text-gray-700">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {renderBorrowModal()}
            {isAdmin && renderEditModal()}
            {isAdmin && renderCreateModal()}
            {isAdmin && renderDeleteModal()}
        </>
    );
}
