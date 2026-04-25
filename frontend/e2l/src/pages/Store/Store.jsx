import { useState, useEffect } from "react";
import { getProducts, getCategories } from "../../services/storeService";
import CartSidebar from "../../components/Store/CartSidebar";
import ProductCart from "../../components/Store/ProductCart";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";


function Store() {

    // Estado de prodcutos y categorias
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();


    //filtros activos
    const [selectedCategory, setSelectedCategory] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");


    //Estado carga
    const [loading, setLoading] = useState(true);

    //carrito
    const { cart, openCart } = useCart();


    //Carga producto cuando cambia los filtros
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, search]);


    //Cargar categorias una vez
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try{
            const data = await getProducts({
                category: selectedCategory,
                search: search
            });
            setProducts(data);
        } catch (error) {
            console.error("Error fetching product:", error);
        }finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try{
            const data = await getCategories();
            setCategories(data);
        } catch (error){
            console.error("Error fetching categories:", error);
        }
    };

    //Ejecuta la busqueda
    const handleSearch = () => {
        setSearch(searchInput);
    };


    //Limpia los filtros
    const handleClearFilters = () => {
        setSelectedCategory("");
        setSearch("");
        setSearchInput("");
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Navbar de la tienda ── */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <h1 className="text-xl font-bold tracking-tight">Store</h1>

                <div className="flex items-center gap-3">
                    {/* Botón órdenes */}
                    <button
                        onClick={() => navigate("/orders")}
                        className="text-sm text-gray-500 hover:text-black transition"
                    >
                        My Orders
                    </button>

                    {/* Botón carrito */}
                    <button
                        onClick={openCart}
                        className="relative flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                    >
                        🛒 Cart
                        {cart.item_count > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {cart.item_count}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* ── Barra de búsqueda ── */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Search
                    </button>
                </div>

                {/* ── Filtros de categoría ── */}
                <div className="flex gap-2 flex-wrap mb-8">

                    {/* Botón para mostrar todos */}
                    <button
                        onClick={() => setSelectedCategory("")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
                            ${selectedCategory === ""
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-600 border-gray-300 hover:border-black"
                            }`}
                    >
                        All
                    </button>

                    {/* Botón por cada categoría */}
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
                                ${selectedCategory === cat.slug
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-black"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}

                    {/* Botón limpiar filtros — solo si hay alguno activo */}
                    {(selectedCategory || search) && (
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-1.5 rounded-full text-sm text-red-500 border border-red-300 hover:bg-red-50 transition"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* ── Grid de productos ── */}
                {loading ? (
                    // Skeleton de carga
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                                <div className="bg-gray-200 rounded-xl h-48 mb-4" />
                                <div className="bg-gray-200 h-4 rounded mb-2" />
                                <div className="bg-gray-200 h-4 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    // Sin resultados
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-5xl mb-4">🔍</p>
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm mt-1">Try a different search or category</p>
                    </div>
                ) : (
                    // Lista de productos
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCart key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Sidebar del carrito ── */}
            <CartSidebar />
        </div>
    );


}

export default Store;