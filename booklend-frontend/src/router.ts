// Simple router using browser History API
type RouteChangeCallback = (path: string) => void;

let listeners: RouteChangeCallback[] = [];

export function navigate(path: string) {
    window.history.pushState({}, "", path);
    notifyListeners(path);
}

export function getCurrentPath(): string {
    return window.location.pathname;
}

export function subscribe(callback: RouteChangeCallback): () => void {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter((l) => l !== callback);
    };
}

function notifyListeners(path: string) {
    listeners.forEach((callback) => callback(path));
}

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
    notifyListeners(getCurrentPath());
});
