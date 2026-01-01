import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !email || !password) return;
        try {
            await signup(username, email, password);
            navigate('/');
        } catch {
            // Error handled in context
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #4cc9f0, #4361ee)',
                        padding: '1rem',
                        borderRadius: '50%',
                        display: 'flex',
                        boxShadow: '0 0 20px rgba(76, 201, 240, 0.5)'
                    }}>
                        <Sparkles size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>Join the Movement</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Start your journey to 2026 domination.</p>
                </div>

                {error && <p style={{ color: '#ff006e', marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        className="neon-btn"
                        style={{ marginTop: '1rem', fontSize: '1.1rem', cursor: 'pointer', background: 'linear-gradient(135deg, #4cc9f0, #4361ee)' }}
                    >
                        Create Account
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Already smashing goals? <Link to="/login" style={{ color: '#f72585', textDecoration: 'none' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
}
