import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateMe } from "../../api/user";   // ← importa updateMe

function RealtorText({ user }) {
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
            <h3 className="text-xl mb-4">Welcome to Ease 2 Lease, {user.first_name}!</h3>
            <p className="mb-4">You are now signed into the agent's portal.</p>
            <p className="mb-4">
                Ease2Lease offers secure and unsecure lines of credit (ELLOC)
                to well-qualified tenant as a deposit alternative for your next real estate transaction.
            </p>
            <p className="mb-4">
                Our process is simple, fast and can help you close deals faster,
                add value to your landlord and tenant clients and make some extra cash on every
                unsecured ELLOC sold to any prospect tenant referred by you.
            </p>
            <p className="mb-4">Ready to get started?</p>
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    checked={dontShow}
                    onChange={(e) => setDontShow(e.target.checked)}
                />
                <span>Don't show this welcome screen again</span>
            </div>
            <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="bg-gray-700 text-white px-6 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Saving..." : "Next"}
            </button>
            <footer className="text-[10px] text-gray-400 text-center mt-6">
                Terms of use. Privacy policy
            </footer>
        </div>
    );
}

export default RealtorText;