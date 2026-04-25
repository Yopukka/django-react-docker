import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser, resendVerification } from "../../services/authService";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResend, setShowResend] =useState(false);
    const [resendSent, setResendSent] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberEmail");

        if (savedEmail) {
            setForm((prev) => ({
                ...prev,
                email: savedEmail
            }));
            setRemember(true);
        }
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setErrors({});
    };

    const validate = () => {
        let newErrors = {};

        if (!form.email) newErrors.email = "Email is required";
        if (!form.password) newErrors.password = "Password is required";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser(form);

            await login(data.access, data.user);

            if (remember) {
                localStorage.setItem("rememberEmail", form.email);
            } else {
                localStorage.removeItem("rememberEmail");
            }

            navigate("/introtext");

        } catch (error) {
            const msg=
                error.reponse?.data?.non_field_error?.[0] || "Login Failed";

                setErrors({ general: msg });

                if (msg === "Please verify your email first"){
                    setShowResend(true);
                }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            <div className="hidden md:block md:w-1/2">
                <img
                    src="images/login.jpg"
                    alt="login"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-5"
                >

                    <div className="text-center">
                        <img
                            src="images/e2llogin.jpg"
                            alt="logo"
                            className="mx-auto w-64 mb-4"
                        />
                        <p className="text-gray-500 text-sm">
                            Welcome back! Please login to continue.
                        </p>
                    </div>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />

                    {errors.email && (
                        <p className="text-red-500 text-xs">
                            {errors.email}
                        </p>
                    )}

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />

                    {errors.password && (
                        <p className="text-red-500 text-xs">
                            {errors.password}
                        </p>
                    )}
                    <div className="text-right">
                        <span
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-gray-500 hover:underline cursor-pointer"
                        >
                            Forgot your password?
                        </span>
                    </div>

                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
                            {errors.general}

                            {/* Resend si la cuenta no está verificada */}
                            {showResend && !resendSent && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await resendVerification(form.email);
                                            setResendSent(true);
                                        } catch {
                                            // fallo silencioso, el usuario puede ir a check-email
                                        }
                                    }}
                                    className="mt-2 w-full text-center underline text-red-700 hover:text-red-900 text-xs"
                                >
                                    Resend verification email
                                </button>
                            )}

                            {resendSent && (
                                <p className="mt-2 text-green-600 text-xs">
                                    ✅ Verification email sent! Check your inbox.
                                </p>
                            )}
                        </div>
                    )}

                    <label className="flex items-center gap-2 text-sm text-gray-500">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) =>
                                setRemember(e.target.checked)
                            }
                        />
                        Remember me
                    </label>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-1/2 py-3 rounded-lg border border-gray-700 text-gray-700"
                        >
                            Sign up
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 py-3 rounded-lg bg-gray-700 text-white"
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default Login;