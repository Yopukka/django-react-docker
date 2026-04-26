import { useEffect, useState } from "react";
import { getMe } from "../../api/user";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function IntroText() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await getMe();

                if (!data) {
                    navigate("/login");
                    return;
                }

                // ← Ahora usa el campo notshow de la BD
                if (data.notshow === true) {
                    redirectByRole(data.rol);
                    return;
                }

                setUser(data);
            } catch (error) {
                console.log("Error cargando usuario", error);
                navigate("/login");
            }
        };
        loadUser();
    }, []);

    //redirige segun el rol
    const redirectByRole = (rol) =>{
        const role = Number(rol);

        if (role === 1){
            navigate("/admin");
        } else {
            navigate("/store");
        }
    };

    //Marca notshoe y redirige
    const handleDontShow = async () => {
        try{
            await api.patch("/user/me/", {notshow: true})
        } catch (error){
            console.error("Error updating notshow:", error);
        } finally{
            redirectByRole(user.rol);
        }
    };

    //continia sin marcar
    const handleContinue = () => {
        redirectByRole(user.rol);
    };

    if(!user) return(
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
        </div>
    );

    const role = Number(user.rol);
    const isAdmin = role === 1;

    return (
        <div className="min-h-screen flex">

            {/* ── Contenido ── */}
            <div className="flex-1 flex flex-col justify-center px-12 py-16 max-w-xl">

                {/* Saludo */}
                <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                    Welcome
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Hi, {user.first_name} 👋
                </h1>
                <p className="text-sm text-gray-400 mb-8">
                    {isAdmin ? "Administrator" : "Customer"}
                </p>

                {/* Texto según rol */}
                {isAdmin ? (
                    <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                        <p>
                            Welcome to the <strong>ShopAuth Admin Panel</strong>. From here you can manage everything about your store.
                        </p>
                        <ul className="space-y-2 list-none">
                            <li>📦 Monitor product inventory and stock levels</li>
                            <li>🛒 Review and manage customer orders</li>
                            <li>✅ Update order status in real time</li>
                            <li>⚠️ Get alerts for low stock products</li>
                        </ul>
                        <p>
                            Head to your <strong>Dashboard</strong> to get started.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                        <p>
                            Welcome to <strong>ShopAuth</strong>. Discover our catalog and start shopping today.
                        </p>
                        <ul className="space-y-2 list-none">
                            <li>🔍 Browse products by category or search</li>
                            <li>🛒 Add items to your cart and checkout easily</li>
                            <li>📋 Track your order history and status</li>
                            <li>🔒 Your account is secure and verified</li>
                        </ul>
                        <p>
                            Head to the <strong>Store</strong> to start shopping.
                        </p>
                    </div>
                )}

                {/* Botones */}
                <div className="mt-10 space-y-3">
                    <button
                        onClick={handleContinue}
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
                    >
                        {isAdmin ? "Go to Dashboard →" : "Go to Store →"}
                    </button>
                    <button
                        onClick={handleDontShow}
                        className="w-full text-sm text-gray-400 hover:text-red-400 transition py-2"
                    >
                        Don't show this again
                    </button>
                </div>
            </div>

            {/* ── Imagen lateral ── */}
            <div className="hidden md:block flex-1">
                <img
                    src="/images/introtext.jpg"
                    alt="intro"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );

}

export default IntroText;