import { useNavigate } from "react-router-dom";

function IndexTenant({ user }) {
    const navigate = useNavigate();

    return (
        <div className="w-full md:w-1/2 bg-[#ececf4] flex flex-col items-center px-10 py-10 relative">

            {/* Avatar primero */}
            <img
                src="/images/perfil.png"
                alt="avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mt-8 mb-4 object-cover"
            />

            {/* Iconos debajo del avatar */}
            <div className="flex gap-6 text-gray-500 text-xl mb-8">
                
                <button className="hover:scale-110 transition">
                    <img
                        src="/images/ajuste.jpg"
                        alt="settings"
                        className="w-6 h-6"/>
                </button>

                <button className="hover:scale-110 transition">
                    <img
                        src="/images/world-wide-web.png"
                        alt="settings"
                        className="w-6 h-6"/>
                </button>

                <button className="hover:scale-110 transition">
                    <img
                        src="/images/campana.png"
                        alt="settings"
                        className="w-6 h-6"/>
                </button>

            </div>

            <br />
            <br />
            
            {/* Welcome */}
            <p className="text-lg font-semibold text-gray-700 text-center mb-2">
                What would you like to do today, {user.first_name}?
            </p>

            <br />
            <br />
            <br />
            <br />

            {/* Botones */}
            <div className="w-full max-w-xs flex flex-col gap-4">

                <button
                    onClick={() => navigate("/elloc/new")}
                    className="bg-[#4b4a63] text-white py-3 rounded-md hover:bg-black transition"
                >
                    Get new ELLOC
                </button>

                <button
                    onClick={() => navigate("/elloc/list")}
                    className="bg-[#4b4a63] text-white py-3 rounded-md hover:bg-black transition"
                >
                    My ELLOC(s)
                </button>

                <button
                    onClick={() => navigate("/claims")}
                    className="bg-[#4b4a63] text-white py-3 rounded-md hover:bg-black transition"
                >
                    Claims
                </button>

            </div>

            {/* Logout */}
            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                }}
                className="absolute bottom-10 text-sm text-gray-500 hover:text-black"
            >
                Logout
            </button>

        </div>
    );
}

export default IndexTenant;