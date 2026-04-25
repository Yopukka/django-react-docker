import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateMe } from "../../api/user";

function TenantText({ user }){

    const navigate = useNavigate();
    const [dontShow, setDontShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        setLoading(true);
        try {
            if (dontShow) {
                await updateMe({ notshow: true });  // ← guarda en BD
            }
        } catch (error) {
            console.error("Error saving preference:", error);
        } finally {
            navigate("/indexbutton");
        }
    };

    return (
        <div className="w-1/2 flex flex-col justify-center items-center bg-gray-100 text-center px-10">

            <h3 className="text-xl mb-4">
                Welcome to Ease 2 Lease, {user.first_name}!
            </h3>

            <p className="mb-4">You are now signed into the tenant's portal.</p>

            <p className="mb-4">
                Ease2Lease offers secure and unsecure lines of credit (ELLOC)
                as a deposit alternative.
            </p>

            <p className="mb-4">
                Our process is simple, fast, and can save you thousands instantly.
            </p>

            <p className="mb-4">Shall we get started?</p>    

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={dontShow}
                    onChange={(e) => setDontShow(e.target.checked)}
                />
                <span>Don't show this welcome screen again</span>
            </div>

            <button
                className="bg-gray-700 text-white px-6 py-2 rounded"
                onClick={handleNext}
            >
                Next
            </button>

        </div>
    );
}

export default TenantText;