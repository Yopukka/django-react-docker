import api from "./api";

// 🔹 obtener usuario actual
export const getMe = async () => {
    try {
        const response = await api.get("/user/me/");
        return response.data;
    } catch (error) {
        console.error("Error en getMe:", error.response?.data);
        throw error;
    }
};

// 🔹 obtener usuarios
export const getUsers = async () => {
    const response = await api.get("/user/");
    return response.data;
};

// 🔹 actualizar usuario (ej: intro)
export const updateMe = async (data) => {
    const response = await api.patch("/user/me/", data);
    return response.data;
};