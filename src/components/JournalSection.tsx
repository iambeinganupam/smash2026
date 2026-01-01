import { useState, useEffect } from 'react';
import { BookOpen, Save, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function JournalSection() {
    const [entry, setEntry] = useState('');
    const [entryId, setEntryId] = useState<number | null>(null);
    const [savedStatus, setSavedStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchJournal();
    }, []);

    const fetchJournal = async () => {
        try {
            const response = await api.get('journal/');
            // Find entry for today
            const todayEntry = response.data.find((e: any) => e.date === today);
            if (todayEntry) {
                setEntry(todayEntry.content);
                setEntryId(todayEntry.id);
            }
        } catch (err) {
            console.error("Failed to fetch journal", err);
        }
    };

    const handleSave = async () => {
        if (!entry.trim()) return;
        setSavedStatus('saving');
        try {
            if (entryId) {
                // Update existing
                await api.patch(`journal/${entryId}/`, { content: entry });
            } else {
                // Create new
                const response = await api.post('journal/', { content: entry });
                setEntryId(response.data.id);
            }
            setTimeout(() => setSavedStatus('saved'), 500);
        } catch (err) {
            console.error("Failed to save journal", err);
            setSavedStatus('unsaved');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEntry(e.target.value);
        setSavedStatus('unsaved');
    };

    return (
        <div className="glass-card" style={{ marginTop: '2rem', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={24} color="#7209b7" />
                    <h2>One Line Daily Journal</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/journal')}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <History size={14} />
                        History
                    </button>

                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {today} • {savedStatus === 'saved' ? 'Saved' : savedStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
                    </span>
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <textarea
                    value={entry}
                    onChange={handleChange}
                    onBlur={handleSave} // Save on blur
                    placeholder="How did you smash your goals today?"
                    maxLength={300} // Keep it roughly "one line" or short enough
                    style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '1rem',
                        color: 'white',
                        fontSize: '1.1rem',
                        fontFamily: 'inherit',
                        resize: 'none',
                        outline: 'none',
                        height: '80px'
                    }}
                />
                {savedStatus === 'unsaved' && (
                    <button
                        onClick={handleSave}
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            background: 'var(--primary-glow)',
                            color: 'white',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Save size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
