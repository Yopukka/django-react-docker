import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { cart, openCart } = useCart();

    const isAdmin = user && Number(user.rol) === 1;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLink = (path, label) => (
        <button
            key={path}
            onClick={() => navigate(path)}
            className={`text-sm transition ${
                location.pathname === path
                    ? "text-black font-semibold"
                    : "text-gray-500 hover:text-black"
            }`}
        >
            {label}
        </button>
    );

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">

            {/* Izquierda: logo + links */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate(isAdmin ? "/admin" : "/store")}
                    className="text-xl font-bold tracking-tight"
                >
                    Sho - ping
                </button>
                <div className="hidden sm:flex items-center gap-5">
                    {navLink("/store", "Store")}
                    {navLink("/orders", "My Orders")}
                    {isAdmin && navLink("/admin", "Admin Dashboard")}
                </div>
            </div>

            {/* Derecha: carrito + logout */}
            <div className="flex items-center gap-3">

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-red-500 transition"
                >
                    Logout
                </button>

                <span className="text-gray-200 select-none">|</span>

                {/* Carrito */}
                <button
                    onClick={openCart}
                    className="relative flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                >
                    🛒 Cart
                    {cart?.item_count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {cart.item_count}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
