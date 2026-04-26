import { useNavigate } from "react-router-dom";

function RolSelector() {
    const navigate = useNavigate();

    const handleSelect = (rol) => {
        navigate("/register", { state: { rol } });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6 py-10">

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">ShopAuth</h1>
                <p className="text-gray-500 mt-2 text-sm">Choose your role to continue</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Admin */}
                <button
                    onClick={() => handleSelect(1)}
                    className="w-56 h-56 bg-gray-50 text-black rounded-2xl flex flex-col items-center justify-center gap-5 border border-gray-200 shadow-sm hover:bg-white hover:border-gray-400 hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >
                    <span className="text-4xl">⚙️</span>
                    <span className="text-xl font-semibold">Admin</span>
                    <p className="text-xs text-gray-500 px-4 text-center">
                        Manage products and orders
                    </p>
                </button>

                {/* User */}
                <button
                    onClick={() => handleSelect(2)}
                    className="w-56 h-56 bg-gray-50 text-black rounded-2xl flex flex-col items-center justify-center gap-5 border border-gray-200 shadow-sm hover:bg-white hover:border-gray-400 hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >
                    <span className="text-4xl">🛍️</span>
                    <span className="text-xl font-semibold">User</span>
                    <p className="text-xs text-gray-500 px-4 text-center">
                        Browse and shop products
                    </p>
                </button>

            </div>

            <button
                onClick={() => navigate("/login")}
                className="mt-10 w-full max-w-md py-3 bg-gray-700 text-white rounded-xl hover:bg-white hover:text-black border-2 border-transparent hover:border-gray-400 transition duration-300"
            >
                Already have an account? Login
            </button>
        </div>
    );
}

export default RolSelector;