import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface JournalEntry {
    id: number;
    content: string;
    date: string;
}

export default function JournalHistoryPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await api.get('journal/');
            // Sort by date descending
            const sorted = response.data.sort((a: JournalEntry, b: JournalEntry) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setEntries(sorted);
        } catch (err) {
            console.error("Failed to fetch journal history", err);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <header className="header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        className="glass-card"
                        style={{
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.05)'
                        }}
                    >
                        <ArrowLeft size={20} color="white" />
                    </button>
                    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Journal History</h1>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {entries.map(entry => (
                    <div
                        key={entry.id}
                        className="glass-card"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            animation: 'fade-in 0.3s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4cc9f0', fontSize: '0.9rem' }}>
                            <Calendar size={16} />
                            <span>{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: 0 }}>
                            {entry.content}
                        </p>
                    </div>
                ))}

                {entries.length === 0 && (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', opacity: 0.7 }}>
                        <p>No journal entries yet. Start writing your legacy!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
