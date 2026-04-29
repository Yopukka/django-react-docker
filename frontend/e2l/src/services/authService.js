   import api from "../api/api";

/*Login del usuario */

export const loginUser = async (credentials) => {
    const response = await api.post("/login/", credentials);
    return response.data;
};


/*Registra el usuario */
export const registerUser = async (data) => {
    const response = await api.post("/user/", data);
    return response.data;
};


/*obtiene el usuario actual */
export const getCurrentUser = async () => {
    const response = await api.get("/user/me/");
    return response.data;
};

/*Verifica el correo electrónico */

export const verifyEmail = async (token) => {
    const response = await api.post("/user/verify-email/",{
        token
    });
    return response.data
};

/*Reenvia el email de verificacion*/
export const resendVerification = async (email) => {
    const response = await api.post("/user/resend-verification/", { email });
    return response.data;
};

export const forgotPassword = async (email) => {
    //manda el email y en el backend generamos el token
    const response = await api.post("/forgot-password/", {email});
    return response.data;
};

export const resetPassword = async (token, password, confirm_password) =>{
    //el tokenveiene de params en el componenete
    const response = await api.post("/reset-password/",{
        token,
        password,
        confirm_password
    });
    return response.data;
};