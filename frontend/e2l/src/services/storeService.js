import api from "../api/api"

// productos
//obtenemos los productos
export const getProducts = async (filters = {}) =>{
    const params = new URLSearchParams();

    //Agregar filtro
    if(filters.category) params.append("category", filters.category);
    if(filters.search) params.append("search", filters.search);

    const response = await api.get(`/store/products/?${params.toString()}`);
    return response.data;

};


//obtiene el detalle de un producto por id
export const getProduct = async (id) => {
    const response = await api.get(`/store/products/${id}/`);
    return response.data;
};


//Obtienes todas las categorias
export const getCategories = async () => {
    const response = await api.get("/store/categories/");
    return response.data;
};


//Carrito

//obtenemos el carrito del usuario autenticado
export const getCart = async () =>{
    const response = await api.get("/store/cart/");
    return response.data;
};

//Agreaga priducto al carrito
export const addToCart = async (productId, quantity = 1) =>{
    const response = await api.post("/store/cart/add/", {
        product_id: productId,
        quantity
    });
    return response.data;
};


//Actualiza la cantidad de un item
export const updateCartItem = async (itemId, quantity) => {
    const response = await api.patch(`/store/cart/update/${itemId}/`, {
        quantity
    });
    return response.data;
};




//Elimina un item del carrito
export const removeCartItem = async (itemId) => {
    const response = await api.delete(`/store/cart/remove/${itemId}/`);
    return response.data;
};




// Ordenes

// Hace el chekout con la dirrecion de envio
export const checkout = async (shippingAddress, notes = "" ) => {
    const response = await api.post("/store/orders/checkout/",{
        shipping_address: shippingAddress,
        notes
    });
    return response.data;
};



//obtiene todas las ordenes del usuario
export const getOrders = async () => {
    const response = await api.get("/store/orders/");
    return response.data;
};

//Vaciar el carrito por completo
export const clearCart = async () =>{
    const response = await parseInt.delete("/store/cart/clear/");
    return response.data;
};


//obtiene el dashborad del admin
export const getAdminDashboard = async () =>{
    const response = await api.get("/store/admin/dashboard/");
    return response.data;
};

//actualizamos los estados de ordenes
export const updateOrderStatus = async (orderId,newStatus) => {
    const reponse = await api.patch(`/store/admin/orders/${orderId}/status/`,{
        status: newStatus
    });
    return response.data;
}
