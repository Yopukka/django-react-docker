import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerification } from "../../services/authService";

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading"); // loading | success | expired | error
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [email, setEmail] = useState("");
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                await verifyEmail(token);
                setStatus("success");
                setTimeout(() => navigate("/login"), 2500);
            } catch (error) {
                const msg = error.response?.data?.error || "";
                if (msg === "Verification link expired") {
                    setStatus("expired");
                } else {
                    setStatus("error");
                }
            }
        };
        confirmEmail();
    }, [token, navigate]);

    const handleResend = async () => {
        if (!email.trim() || cooldown > 0) return;

        setResendLoading(true);
        setResendMessage("");

        try {
            await resendVerification(email.trim());
            setResendMessage("✅ New verification email sent! Check your inbox.");

            setCooldown(120);
            const interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) { clearInterval(interval); return 0; }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            const msg =
                err.response?.data?.email?.[0] ||
                err.response?.data?.non_field_errors?.[0] ||
                "Something went wrong. Try again.";
            setResendMessage(`❌ ${msg}`);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 text-center w-full max-w-md">

                {/* LOADING */}
                {status === "loading" && (
                    <>
                        <div className="text-5xl mb-4">⏳</div>
                        <h1 className="text-2xl font-bold mb-2">Verifying your email...</h1>
                        <p className="text-gray-500">Please wait.</p>
                    </>
                )}

                {/* SUCCESS */}
                {status === "success" && (
                    <>
                        <div className="text-5xl mb-4">✅</div>
                        <h1 className="text-2xl font-bold mb-2">Email verified!</h1>
                        <p className="text-gray-500">Redirecting to login...</p>
                    </>
                )}

                {/* EXPIRED — muestra form de resend */}
                {status === "expired" && (
                    <>
                        <div className="text-5xl mb-4">⏰</div>
                        <h1 className="text-2xl font-bold mb-2">Link Expired</h1>
                        <p className="text-gray-500 mb-6">
                            Your verification link has expired (30 min limit).
                            <br />Enter your email to receive a new one.
                        </p>

                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
                        />

                        {resendMessage && (
                            <p className={`text-sm mb-3 ${resendMessage.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
                                {resendMessage}
                            </p>
                        )}

                        <button
                            onClick={handleResend}
                            disabled={resendLoading || cooldown > 0 || !email.trim()}
                            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendLoading ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Send New Link"}
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition"
                        >
                            Back to Login
                        </button>
                    </>
                )}

                {/* ERROR GENÉRICO */}
                {status === "error" && (
                    <>
                        <div className="text-5xl mb-4">❌</div>
                        <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
                        <p className="text-gray-500 mb-6">
                            This verification link is invalid or has already been used.
                        </p>
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

export default VerifyEmail;