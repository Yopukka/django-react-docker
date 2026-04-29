import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateMe } from "../../api/user";

function UserText({ user }){
     
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
                Welcome to <strong>ShopAuth</strong>. Discover our catalog and start shopping today.
            </p>
            <ul className="space-y-2 list-none">
                <li>🔍 Browse products by category or search</li>
                <li>🛒 Add items to your cart and checkout easily</li>
                <li>📋 Track your order history and status</li>
                <li>🔒 Your account is secure and verified</li>
            </ul>
            <p>
                Head to the <strong>Store</strong> to start shopping.
            </p>
        </div>
    )
}

export default UserText;