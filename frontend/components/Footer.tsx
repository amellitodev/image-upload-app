export default function Footer() {
    return (
        <footer className="py-6 text-center">
            <div className="container mx-auto px-4">
                <p className="text-white/60 text-sm">© {new Date().getFullYear()} Image Upload App</p>
            </div>
        </footer>
    );
}
