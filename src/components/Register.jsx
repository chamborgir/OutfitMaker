import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Check your email for confirmation");
            navigate("/");
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister} className="login-form">
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;
