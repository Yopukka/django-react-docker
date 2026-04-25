import { useNavigate } from "react-router-dom";

function RolSelector() {
    const navigate = useNavigate();

    const handleSelect = (rol) => {
        navigate("/register", { state: { rol } });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6 py-10">

            {/* Logo / Branding */}
            <div className="text-center mb-12">
                <img
                    src="images/e2llogo.png"
                    alt="Ease2Lease"
                    className="w-20 mx-auto mb-4"
                />

                <h1 className="text-4xl font-bold text-gray-800">
                    Ease 2 Lease
                </h1>

                <p className="text-gray-500 mt-2 text-sm">
                    Choose your role to continue
                </p>
            </div>

            {/* Botones de roles */}
            <div className="flex flex-col md:flex-row gap-6">

                {/* Landlord */}
                <button
                    onClick={() => handleSelect(2)}
                    className="w-56 h-56 bg-gray-50 text-black rounded-2xl flex flex-col items-center justify-center gap-5 border border-gray-200 shadow-sm hover:bg-white hover:border-gray-400 hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >
                    <span className="text-xl font-semibold">Landlord</span>
                    <img
                        src="images/landlord.jpg"
                        alt="landlord"
                        className="w-16 h-16 object-cover rounded-full"
                    />
                    <p className="text-xs text-gray-500 px-4">
                        Manage properties and tenants
                    </p>
                </button>

                {/* Realtor */}
                <button
                    onClick={() => handleSelect(3)}
                    className="w-56 h-56 bg-gray-50 text-black rounded-2xl flex flex-col items-center justify-center gap-5 border border-gray-200 shadow-sm hover:bg-white hover:border-gray-400 hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >
                    <span className="text-xl font-semibold">Realtor</span>
                    <img
                        src="images/realtor.jpg"
                        alt="realtor"
                        className="w-16 h-16 object-cover rounded-full"
                    />
                    <p className="text-xs text-gray-500 px-4">
                        Connect clients with homes
                    </p>
                </button>

                {/* Tenant */}
                <button
                    onClick={() => handleSelect(4)}
                    className="w-56 h-56 bg-gray-50 text-black rounded-2xl flex flex-col items-center justify-center gap-5 border border-gray-200 shadow-sm hover:bg-white hover:border-gray-400 hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >
                    <span className="text-xl font-semibold">Tenant</span>
                    <img
                        src="images/tenant.jpg"
                        alt="tenant"
                        className="w-16 h-16 object-cover rounded-full"
                    />
                    <p className="text-xs text-gray-500 px-4">
                        Rent smarter and faster
                    </p>
                </button>

            </div>

            {/* Botón Login */}
            <button
                onClick={() => navigate("/login")}
                className="mt-10 w-full max-w-[720px] py-3 bg-gray-700 text-white rounded-xl hover:bg-white hover:text-black border-2 border-transparent hover:border-gray-400 shadow-sm hover:shadow-md transition duration-300"
            >
                Already have an account? Login
            </button>

        </div>
    );
}

export default RolSelector;