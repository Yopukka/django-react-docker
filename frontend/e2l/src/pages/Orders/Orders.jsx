import { useState, useEffect } from "react";
import { getOrders } from "../../services/storeService";
import { useNavigate } from "react-router-dom";

function Orders(){

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    //colores por estado de orden
    const statusStyles = {
        pending: "bg-yellow-50 text-tellow-700",
        confirmed: "bg-blue-50 text-blue-700",
        shipped: "bg-purple-50 text-purple-700",
        delivered: "bg-green-50 text-green-700",
        cancelled: "bg-red-50 text-red-700",
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try{
            const data = await getOrders();
            serOrders(data);
        } catch (error){
            console.error("Error fetching orders:", error);
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Navbar ── */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <h1 className="text-xl font-bold">My Orders</h1>
                <button
                    onClick={() => navigate("/store")}
                    className="text-sm text-gray-500 hover:text-black transition"
                >
                    ← Back to Store
                </button>
                <button
                    onClick={() => navigate("/admin")}
                    className="text-sm text-gray-500 hover:text-black transition"
                >
                    ← Admin
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-8">

                {loading ? (
                    // Skeleton de carga
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                                <div className="bg-gray-200 h-4 rounded w-1/4 mb-4" />
                                <div className="bg-gray-200 h-4 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    // Sin órdenes
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-5xl mb-4">📦</p>
                        <p className="text-lg font-medium">No orders yet</p>
                        <p className="text-sm mt-1 mb-6">Start shopping to see your orders here</p>
                        <button
                            onClick={() => navigate("/store")}
                            className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                        >
                            Go to Store
                        </button>
                    </div>
                ) : (
                    // Lista de órdenes
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                                {/* ── Header de la orden ── */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <div>
                                        <p className="text-sm font-semibold">Order #{order.id}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Badge de estado */}
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusStyles[order.status] || "bg-gray-50 text-gray-600"}`}>
                                            {order.status}
                                        </span>
                                        <span className="font-bold">${order.total}</span>
                                    </div>
                                </div>

                                {/* ── Items de la orden ── */}
                                <div className="px-6 py-4 space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">📦</span>
                                                <div>
                                                    <p className="text-sm font-medium">{item.product_name}</p>
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium">${item.subtotal}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Footer con dirección ── */}
                                {order.shipping_address && (
                                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">
                                            📍 {order.shipping_address}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;