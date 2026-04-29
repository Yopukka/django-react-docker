import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../services/authService";

const ROL = {
    LANDLORD: 2,
    REALTOR: 3,
    TENANT: 4
};

function RegisterUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const rol = location.state?.rol;

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        phone: "",
        company: "",
        brokerage: "",
        terms: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });

        setErrors({
            ...errors,
            [name]: "",
            general: ""
        });
    };

    const validate = () => {
        let newErrors = {};

        if (!form.first_name) newErrors.first_name = "First name is required";
        if (!form.last_name) newErrors.last_name = "Last name is required";
        if (!form.email) newErrors.email = "Email is required";
        if (!form.password) newErrors.password = "Password is required";
        if (!form.confirmPassword)
            newErrors.confirmPassword = "Confirm your password";

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!form.terms) newErrors.terms = "You must accept terms";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rol) {
            navigate("/");
            return;
        }

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setSuccess("");

        try {
            const { confirmPassword, ...dataToSend } = form;

            await registerUser({
                ...dataToSend,
                rol
            });

            setSuccess("Account created successfully");

            setTimeout(() => {
                navigate("/check-email", {state: { email: form.email }});
            }, 1500);

        } catch (error) {

            console.log(error.response?.data);  
            const apiErrors = error.response?.data || {};

            setErrors({
                first_name: apiErrors.first_name?.[0] || "",
                last_name: apiErrors.last_name?.[0] || "",
                email: apiErrors.email?.[0] || "",
                password: apiErrors.password?.[0] || "",
                phone: apiErrors.phone?.[0] || "",
                general:
                    apiErrors.detail ||
                    apiErrors.non_field_errors?.[0] ||
                    "Registration failed"
            });
        } finally {
            setLoading(false);
        }
    };

    /* ---------- VALIDACIONES VISUALES ---------- */

    const emailValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    const passwordRules = {
        length: form.password.length >= 8,
        upper: /[A-Z]/.test(form.password),
        lower: /[a-z]/.test(form.password),
        number: /\d/.test(form.password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(form.password)
    };

    const passedRules = Object.values(passwordRules).filter(Boolean).length;

    const strengthWidth = `${(passedRules / 5) * 100}%`;

    const getStrengthText = () => {
        if (passedRules <= 2) return "Weak";
        if (passedRules === 3 || passedRules === 4) return "Medium";
        return "Strong";
    };

    return (
        <div className="min-h-screen flex">

            {/* Imagen */}
            <div className="hidden md:block md:w-1/2">
                <img
                    src="/images/house.jpg"
                    alt="house"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 py-10 overflow-y-auto">

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4"
                >

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Ease Lease
                        </h1>

                        <p className="text-gray-500 text-sm mt-2">
                            Create your account
                        </p>
                    </div>

                    {/* Success */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-2 rounded-lg">
                            {success}
                        </div>
                    )}

                    {/* Error */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
                            {errors.general}
                        </div>
                    )}

                    {/* Names */}
                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <input
                                name="first_name"
                                placeholder="First Name"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        <div className="w-1/2">
                            <input
                                name="last_name"
                                placeholder="Last Name"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                    </div>


                    <input
                        name="phone"
                        placeholder="Phone"
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-4 py-3"
                    />

                    {/* Email */}
                    <div>
                        <input
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        {form.email && (
                            <p
                                className={`text-xs mt-2 ${
                                    emailValid
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {emailValid
                                    ? "✓ Valid email format"
                                    : "✗ Invalid email format"}
                            </p>
                        )}

                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        {/* Strength */}
                        {form.password && (
                            <>
                                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                                    <div
                                        className="h-2 bg-gray-700 rounded-full transition-all"
                                        style={{
                                            width: strengthWidth
                                        }}
                                    />
                                </div>

                                <p className="text-xs mt-1 text-gray-600">
                                    Strength: {getStrengthText()}
                                </p>

                                <div className="space-y-1 mt-2 text-xs">
                                    <p className={passwordRules.length ? "text-green-600" : "text-red-500"}>
                                        ✓ 8+ characters
                                    </p>

                                    <p className={passwordRules.upper ? "text-green-600" : "text-red-500"}>
                                        ✓ Uppercase letter
                                    </p>

                                    <p className={passwordRules.lower ? "text-green-600" : "text-red-500"}>
                                        ✓ Lowercase letter
                                    </p>

                                    <p className={passwordRules.number ? "text-green-600" : "text-red-500"}>
                                        ✓ Number
                                    </p>

                                    <p className={passwordRules.symbol ? "text-green-600" : "text-red-500"}>
                                        ✓ Symbol
                                    </p>
                                </div>
                            </>
                        )}

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm */}
                    <div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        {form.confirmPassword && (
                            <p
                                className={`text-xs mt-2 ${
                                    form.password === form.confirmPassword
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {form.password === form.confirmPassword
                                    ? "✓ Passwords match"
                                    : "✗ Passwords do not match"}
                            </p>
                        )}

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Terms */}
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            name="terms"
                            onChange={handleChange}
                        />
                        I accept terms & conditions
                    </label>

                    {errors.terms && (
                        <p className="text-red-500 text-xs">
                            {errors.terms}
                        </p>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gray-700 text-white hover:bg-black transition disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Sign up"}
                    </button>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-gray-800 cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default RegisterUser;