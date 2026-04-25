import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children}) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //Traer el usuario actual 
    const fetchUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await getCurrentUser();
            setUser(data);
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    //login
    const login = async (token, userData = null) => {
        localStorage.setItem("token", token);

        if(userData){
            setUser(userData);
            setLoading(false);
        }else{
            await fetchUser();
        }
    };


    //logout
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() =>{
        fetchUser();
    }, []);

    return(
        <AuthContext.Provider value={{ user, loading, login, logout, fetchUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}