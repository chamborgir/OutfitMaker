import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";
import "./Login.css";
import emailjs from "@emailjs/browser";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);
        if (error) {
            alert("Login failed: " + error.message);
        } else {
            sendEmail(email, password); // Send verification email
            navigate("/homepage");
        }
    };

    const sendEmail = (email, password) => {
        const templateParams = {
            to_email: email, // Must match your EmailJS template variable
            to_password: password,
        };

        emailjs
            .send(
                "service_2hw475m", // Replace with your actual service ID
                "template_z6erja8", // Replace with your actual template ID
                templateParams,
                "32_hmnUTkbX3geQDy" // Replace with your actual public key
            )
            .then((response) => {
                console.log(response.status, response.text);
            })
            .catch((err) => {
                console.error("Failed to send verification email.", err);
            });
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="auth-footer">
                Don't have an account?{" "}
                <Link to="/register">Create one here</Link>
            </p>
        </div>
    );
};

export default Login;
