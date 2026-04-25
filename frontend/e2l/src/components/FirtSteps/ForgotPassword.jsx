import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

function ForgotPassword(){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error,setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!email.trim()){
            setError("Please enter your email.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try{
            await forgotPassword(email.trim());
            //mismo mensaje predeterminado
            setMessage(
                "If that email is registered you recive a reset "
            );
        } catch (err){
            //solo debe de fallar si el servidor esta caido
            setError("Something went wrong. Please try again");
        }finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

                <div className="text-5xl mb-4">🔑</div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Forgot your password?
                </h1>

                <p className="text-gray-500 text-sm mb-6">
                    Enter your email and we'll send you a reset link.
                </p>

                {/* Mostramos el formulario solo si no se envió todavía */}
                {!message ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition"
                        >
                            Back to Login
                        </button>

                    </form>
                ) : (
                    // Una vez enviado mostramos confirmación y botón de login
                    <>
                        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-sm">
                            {message}
                        </div>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
                        >
                            Back to Login
                        </button>
                    </>
                )}

            </div>
        </div>
    );


}

export default ForgotPassword;

