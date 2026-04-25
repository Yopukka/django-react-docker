import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";;
import { useNavigate } from "react-router-dom";

import IndexLandlord from "./IndexLanlord";
import IndexRealtor from "./IndexRealtor";
import IndexTenant from "./IndexTenant";

function IndexButton(){

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                User not found
            </div>
        );
    }
    
    console.log(typeof user.rol);

    const role = Number(user.rol);

    return (
        <div className="flex min-h-screen">

            {role === 2 && <IndexLandlord user={user} />}

            {role === 3 && <IndexRealtor user={user} />}

            {role === 4 && <IndexTenant user={user} />}

            <div className="hidden md:block md:w-1/2">
                <img
                    src="/images/indexuser.jpg"
                    alt="dashboard"
                    className="w-full h-full object-cover"
                />
            </div>

        </div>
    );
}


export default IndexButton;