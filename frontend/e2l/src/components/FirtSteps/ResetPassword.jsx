import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";

function ResetPassword(){
    //usamos params para eleer el token en la url
    const { token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        password: "",
        confirm_password: "" 
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //validacion basica en el front
        if(!form.password || !form.confirm_password){
            setErrors({general: "Please fill in both fields."});
            return;
        }

        if (form.password !== form.confirm_password){
            setErrors({ confirm_password: "Password do not match"});
            return
        }

        setLoading(true);
        setErrors({});

        try{
            //Mandamos el token en url
            await resetPassword(token, form.password, form.confirm_password);
            setSuccess(true);

            //redirigimos al login 
            setTimeout(() => navigate("/login"), 2500);
        } catch(err){

            // Manejamos los errores
            const data = err.response?.data || {};
            setErrors({
                password : data.password?.[0] || "",
                confirm_password: data.confirm_password?.[0] || "",
                token: data.token?.[0] || "",
                general:data.non_field_errors?.[0] || "",
            });
        } finally {
            setLoading(false);
        }
    };

    // Pantalla de éxito
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold mb-2">Password updated!</h1>
                    <p className="text-gray-500">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

                <div className="text-5xl mb-4">🔒</div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Reset your password
                </h1>

                <p className="text-gray-500 text-sm mb-6">
                    Choose a new secure password for your account.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="New password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Confirm new password"
                            value={form.confirm_password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                        {errors.confirm_password && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>
                        )}
                    </div>

                    {/* Errores del token (expirado, inválido) */}
                    {errors.token && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {errors.token}
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="block mt-2 underline text-red-700 text-xs"
                            >
                                Request a new reset link
                            </button>
                        </div>
                    )}

                    {errors.general && (
                        <p className="text-red-500 text-sm">{errors.general}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Reset Password"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition"
                    >
                        Back to Login
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ResetPassword;

