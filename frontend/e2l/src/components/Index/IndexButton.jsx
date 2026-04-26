import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function IndexButton(){

    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect (() => {
        if(!loading && user){
            //si ya marco salta al intro
            if(user.notshoe === true){
                const role = Number(user.rol);
                if(role === 1){
                    navigate("/admin");
                } else {
                    navigate("/store");
                }
            } else {
                //Muestra el intro
                navigate("/introtext");
            }
        }
    }, [user, loading]);

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return null;
}


export default IndexButton;