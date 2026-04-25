import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../services/storeService";



//Creamos el contexto 
const CartContext = createContext();


export function CartProvider({ children }){


    // Estado del carrito - item, total y contador
    const [cart, setCart] = useState({items: [], total: 0, item_count: 0});


    //Estado del sidebar
    const [isOpen, setIsOpen] = useState(false);


    //Estado de carga para spinners
    const [loading, setLoading] = useState(false);

    //Cargar el carrito
    useEffect(() => {
        fetchCart();
    }, []);


    //Obtiene el carrito del servidor
    const fetchCart = async () =>{
        try {
            const data = await getCart();
            setCart(data);
        }catch (error){
            console.log("Cart not available:", error);
        }
    };


    //Abre el sidebar del carrito
    const openCart = () => setIsOpen(true);


    //Cierra el sidebar del carrito
    const closeCart = () => setIsOpen(false);

    //Agrega un producto y abre el sidebar
    const handleAddToCart = async (productId, quantity = 1 ) => {
        setLoading(true);
        try{
            const updateCart = await addToCart(productId, quantity);
            setCart(updateCart);
            openCart();
        } catch (error){
            console.error("error adding to cart:", error);
        } finally {
            setLoading(false);
        }
    };


    //Actualiza la cantidad de un item
    const handleUpdateItem = async (itemId,quantity) => {
        setLoading(true);
        try{
            const updateCart = await updateCartItem(itemId,quantity);
            setCart(updateCart);
        } catch (error){
            console.error("Error updatinf item:", error);
        } finally {
            setLoading(false);
        }
    };


    //elimina un item del carrito
    const handleRemoveItem = async (itemId) => {
        setLoading(true);
        try{
            const updateCart = await removeCartItem(itemId);
            setCart(updateCart);
        }catch (error){
            console.error("Error removing item:", error);
        } finally {
            setLoading(false);
        }
    };



    //vacia el carrito completo
    const handleClearCart = async () => {
        setLoading(true);
        try{
            const updateCart =await clearCart();
            setCart(updateCart);
        } catch(error){
            console.error("Error clearing cart:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            isOpen,
            loading,
            openCart,
            closeCart,
            fetchCart,
            handleAddToCart,
            handleUpdateItem,
            handleRemoveItem,
            handleClearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}


// Hook para user le carrito en cualrquier componente
export const useCart = () => useContext(CartContext);