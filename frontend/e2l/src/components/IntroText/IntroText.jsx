import { useEffect, useState } from "react";
import { getMe } from "../../api/user";
import { useNavigate } from "react-router-dom";
import TenantText from "./TenantText";
import LandLordText from "./LandlordText";
import RealtorText from "./RealtorText";

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
                    navigate("/indexbutton");
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

    if (!user) return <p>Cargando...</p>;

    return (
        <div className="flex h-screen">
            {user.rol === 2 && <LandLordText user={user} />}
            {user.rol === 3 && <RealtorText user={user} />}
            {user.rol === 4 && <TenantText user={user} />}
            <div className="w-1/2">
                <img src="/images/introtext.jpg" alt="introtext" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

export default IntroText;