import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resendVerification } from "../../services/authService";

function CheckEmail(){
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [cooldown,setCooldown] = useState(0);

    const handleResend = async () => {
        if (!email || cooldown > 0) return;

        setLoading(true);
        setMessage("");
        setError("");

        try{
            await resendVerification(email);
            setMessage("Verification email sent! check your inbox");

            //cooldown de 120 en el front
            setCooldown(120);
            const interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1){
                        clearInterval(interval);
                        return 0
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err){
            const msg = 
                err.response?.data?.email?.[0] ||
                err.response?.data?.non_field_errors?.[0] ||
                "Something went wrong. Try again";
            setError(msg);
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

                {/* Icon */}
                <div className="text-6xl mb-4">📩</div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Check Your Email
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-2 leading-relaxed">
                    Your account has been created successfully.
                    <br />
                    We sent an activation link to:
                </p>

                {email && (
                    <p className="font-semibold text-gray-800 mb-6">{email}</p>
                )}

                {/* Tips */}
                <div className="bg-gray-50 border rounded-xl p-4 mb-6 text-sm text-gray-500">
                    <p>✔ Check spam or junk folder</p>
                    <p>✔ Open the activation email</p>
                    <p>✔ Click on "Activate Account"</p>
                </div>

                {/* Feedback messages */}
                {message && (
                    <p className="text-green-600 text-sm mb-4">{message}</p>
                )}
                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                {/* Resend button */}
                <button
                    onClick={handleResend}
                    disabled={loading || cooldown > 0}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? "Sending..."
                        : cooldown > 0
                        ? `Resend in ${cooldown}s`
                        : "Resend Verification Email"}
                </button>

                {/* Go to login */}
                <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
                >
                    Go to Login
                </button>

            </div>
        </div>
    );
}

export default CheckEmail;