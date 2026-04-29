import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateMe } from "../../api/user";

function AdminText({ user }){
     
    const navigate = useNavigate();
    const [dontShow, setDontShow] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleNext = async () =>{
        setLoading(true);

        try{
            if(dontShow){
                await updateMe({ notShow: true }); // guarda en db
            }
        } catch (error){
            console.error("Error saving preference:", error);
        } finally{
            navigate("/indexbutton");
        }
    };

    return (
        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
                Welcome to the <strong>ShopAuth Admin Panel</strong>. From here you can manage everything about your store.
            </p>
            <ul className="space-y-2 list-none">
                <li>📦 Monitor product inventory and stock levels</li>
                <li>🛒 Review and manage customer orders</li>
                <li>✅ Update order status in real time</li>
                <li>⚠️ Get alerts for low stock products</li>
            </ul>
            <p>
                Head to your <strong>Dashboard</strong> to get started.
            </p>
        </div>
    )
}

export default AdminText;

