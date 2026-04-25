import { useState } from "react";
import { useCart } from "../../context/CartContext";

function ProductCart({ product }) {

    //Cantidad seleccionada antes de agregar
    const [quantity, setQuantity] = useState(1); 

    //Mensaje cuando no hay stock disponible
    const [stockWarning, setStockingWarning] = useState("");

    //para agregar al carrito
    const { handleAddToCart, loading } = useCart();

    // url con image
    const imageUrl = product.image
        ? `${import.meta.env.VITE_MEDIA_URL}${product.image}`
        : null;


    const handleAdd = () => {

        // verifica el stock antes de agregar
        if(quantity > product.stock){
            setStockingWarning(`Only ${product.stock} units available`);
            return;
        };
        setStockingWarning("");
        handleAddToCart(product.id, quantity);
    };


    



    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition group">

            {/* ── Imagen del producto ── */}
            <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                ) : (
                    // Placeholder si no hay imagen
                    <span className="text-5xl">📦</span>
                )}
            </div>

            {/* ── Info del producto ── */}
            <div className="p-4">

                {/* Categoría */}
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    {product.category_name}
                </p>

                {/* Nombre */}
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {product.name}
                </h3>

                {/* Precio y stock */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold">${product.price}</span>
                    {/* Muestra badge de stock */}
                    {product.in_stock ? (
                        //Muestra unidades restantes
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                            product.stock <= 3
                                ? "text-orange-600 bg-orange-50"
                                : "text-green-600 bg-green-50"
                        }`}>
                            {product.stock <= 3 ? `Only ${product.stock} left` : "In stock"}
                        </span>
                    ) : (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                            Out of stock
                        </span>
                    )}
                </div>

                {/*Mensaje de stock insuficiente*/}
                {stockWarning &&(
                    <p className="text-xs text-red-500 mb-2">⚠️ {stockWarning}</p>
                )}

                {/* ── Selector de cantidad + botón agregar ── */}
                {product.in_stock && (
                    <div className="flex items-center gap-2">

                        {/* Selector de cantidad */}
                        <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="px-2 py-1 text-gray-500 hover:text-black transition text-sm"
                            >
                                −
                            </button>
                            <span className="px-2 text-sm font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                className="px-2 py-1 text-gray-500 hover:text-black transition text-sm"
                            >
                                +
                            </button>
                        </div>

                        {/* Botón agregar al carrito */}
                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="flex-1 bg-black text-white text-sm py-1.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            Add to cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductCart;