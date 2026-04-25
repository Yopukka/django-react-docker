import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { checkout } from "../../services/storeService";


function CartSidebar() {

    const {
        cart,
        isOpen,
        closeCart,
        handleUpdateItem,
        handleRemoveItem,
        handleClearCart,
        fetchCart,
    } = useCart();


    //Estado del formulario
    const [showCheckout, setShowCheckout] = useState(false);   
    const [shippingAddress, setShippingAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [checkoutLoading,setCheckoutLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
   


    //Procesa la orden
    const handleCheckout = async () => {
        if (!shippingAddress.trim()) return;

        setCheckoutLoading(true);
        try{
            await checkout(shippingAddress, notes);
            await fetchCart();
            setOrderSuccess(true);
            setShowCheckout(false);
            setShippingAddress("");
            setNotes("");
        }catch(error){
            console.error("checkot error:", error);
        }finally {
            setCheckoutLoading(false);
        }
    };

   



    return (
        <>
            {/* ── Overlay oscuro detrás del sidebar ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={closeCart}
                />
            )}

            {/* ── Sidebar deslizable ── */}
            <div className={`
                fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${isOpen ? "translate-x-0" : "translate-x-full"}
            `}>

                {/* ── Header del sidebar ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold">
                        Your Cart
                        {cart.item_count > 0 && (
                            <span className="ml-2 text-sm font-normal text-gray-400">
                                ({cart.item_count} items)
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={closeCart}
                        className="text-gray-400 hover:text-black transition text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Mensaje de éxito después del checkout ── */}
                {orderSuccess && (
                    <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                        ✅ Order placed successfully!
                        <button
                            onClick={() => setOrderSuccess(false)}
                            className="ml-2 underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* ── Lista de items ── */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                    {(cart.items || []).length === 0 ? (
                        // Carrito vacío
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 pb-20">
                            <p className="text-5xl mb-4">🛒</p>
                            <p className="font-medium">Your cart is empty</p>
                            <p className="text-sm mt-1">Add some products to get started</p>
                        </div>
                    ) : (
                        (cart.items || []).map((item) => (
                            <div key={item.id} className="flex gap-4 items-start">

                                {/* Imagen del item */}
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                   {item.product.image ? (
                                        <img
                                            src={item.product.item}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    ) :(
                                        <span className="text-2xl">📦</span>
                                    )}
                                </div>

                                {/* Info del item */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.product.name}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        ${item.product.price}
                                    </p>

                                    {/* Controles de cantidad */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => handleUpdateItem(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="px-2 py-0.5 text-gray-500 hover:text-black transition disabled:opacity-30"
                                            >
                                                −
                                            </button>
                                            <span className="px-2 text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateItem(item.id, item.quantity + 1)}
                                                className="px-2 py-0.5 text-gray-500 hover:text-black transition"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Botón eliminar */}
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-xs text-red-400 hover:text-red-600 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Subtotal del item */}
                                <p className="text-sm font-semibold flex-shrink-0">
                                    ${item.subtotal}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* ── Footer con total y checkout ── */}
                {(cart.items || []).length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 space-y-3">

                        {/* Total */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total</span>
                            <span className="text-xl font-bold">${cart.total}</span>
                        </div>

                        {/* Formulario de checkout expandible */}
                        {showCheckout && (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Shipping address *"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <textarea
                                    placeholder="Notes (optional)"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                                />
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="space-y-2">
                            {!showCheckout ? (
                                <button
                                    onClick={() => setShowCheckout(true)}
                                    className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
                                >
                                    Checkout
                                </button>
                            ) : (
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading || !shippingAddress.trim()}
                                    className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
                                >
                                    {checkoutLoading ? "Placing order..." : "Place Order"}
                                </button>
                            )}

                            {/* Vaciar carrito */}
                            <button
                                onClick={handleClearCart}
                                className="w-full text-sm text-gray-400 hover:text-red-500 transition py-1"
                            >
                                Clear cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CartSidebar;

