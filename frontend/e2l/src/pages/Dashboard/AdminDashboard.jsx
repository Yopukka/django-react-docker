import { useState, useEffect } from "react";
import { getAdminDashboard, updateOrderStatus } from "../../services/storeService";
import { useNavigate } from "react-router-dom";

function AdminDashboard(){

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const statuStyles = {
        pendign: "bg-yellow-50 text-yellow-700",
        confirmed: "bg-blue-50 text-blue-700",
        shipped: "bg-purple-50 text-purple-700",
        delivered: "bg-green-50 text-green-700",
        cancelled: "bg-red-50 text-red-700"
    };

    useEffect (() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try{
            const data = await getAdminDashboard();
            setDashboard(data);
        } catch (error){
            console.error("Error fetching dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    //Cambia el estado de una orden y recarga el dashboard
    const handleStatusChange = async (orderId,newStatus) => {
        try{
            await updateOrderStatus(orderId,newStatus);
            fetchDashboard();
        } catch (error){
            coneolo.error("Error updating status:", error);
        }
    };

    if (loading){
        return(
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Navbar ── */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => navigate("/store")}
                    className="text-sm text-gray-500 hover:text-black transition"
                >
                    Go to Store →
                </button>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

                {/* ── Cards de resumen ── */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        { label: "Total Products", value: dashboard.summary.total_products, icon: "📦" },
                        { label: "Out of Stock",   value: dashboard.summary.out_of_stock,   icon: "❌" },
                        { label: "Low Stock",      value: dashboard.summary.low_stock,      icon: "⚠️" },
                        { label: "Total Orders",   value: dashboard.summary.total_orders,   icon: "🛒" },
                        { label: "Pending",        value: dashboard.summary.pending_orders, icon: "⏳" },
                    ].map((card) => (
                        <div key={card.label} className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                            <p className="text-2xl mb-1">{card.icon}</p>
                            <p className="text-2xl font-bold">{card.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Productos con poco stock ── */}
                {dashboard.low_stock_products.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="font-semibold">⚠️ Low Stock Products</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {dashboard.low_stock_products.map((product) => (
                                <div key={product.id} className="flex items-center justify-between px-6 py-3">
                                    <div>
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <p className="text-xs text-gray-400">{product.category_name}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        product.stock === 0
                                            ? "bg-red-50 text-red-600"
                                            : "bg-orange-50 text-orange-600"
                                    }`}>
                                        {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Órdenes recientes ── */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold">Recent Orders</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {dashboard.recent_orders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-3">
                                <div>
                                    <p className="text-sm font-medium">Order #{order.id}</p>
                                    <p className="text-xs text-gray-400">{order.user_email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">${order.total}</span>
                                    {/* Selector de estado */}
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusStyles[order.status]}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default AdminDashboard;