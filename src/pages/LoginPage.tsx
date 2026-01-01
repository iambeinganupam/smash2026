import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;
        try {
            await login(username, password);
            navigate('/');
        } catch {
            // Error handled in context/displayed via error state
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
                        background: 'linear-gradient(135deg, #f72585, #7209b7)',
                        padding: '1rem',
                        borderRadius: '50%',
                        display: 'flex',
                        boxShadow: '0 0 20px rgba(247, 37, 133, 0.5)'
                    }}>
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue smashing your goals.</p>
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
                        style={{ marginTop: '1rem', fontSize: '1.1rem', cursor: 'pointer' }}
                    >
                        Enter Dashboard
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#4cc9f0', textDecoration: 'none' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
