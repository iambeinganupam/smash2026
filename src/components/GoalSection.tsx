import { useState, useEffect } from 'react';
import { Plus, Trash2, Trophy } from 'lucide-react';
import api from '../api/axios';

interface Goal {
    id: number; // Backend uses number IDs
    title: string;
    type: string;
}

interface GoalSectionProps {
    title: string;
    type: 'long-term' | 'short-term';
}

export default function GoalSection({ title, type }: GoalSectionProps) {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [inputValue, setInputValue] = useState('');

    // Fetch goals from API
    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await api.get('goals/');
            // Filter by type on client side, or better, backend query param
            setGoals(response.data.filter((g: any) => g.type === type));
        } catch (err) {
            console.error("Failed to fetch goals", err);
        }
    };

    const addGoal = async () => {
        if (!inputValue.trim()) return;
        try {
            // Optimistic update could go here, but let's just wait for API
            const response = await api.post('goals/', {
                title: inputValue.trim(),
                type: type
            });
            setGoals([...goals, response.data]);
            setInputValue('');
        } catch (err) {
            console.error("Failed to add goal", err);
        }
    };

    const deleteGoal = async (id: number) => {
        try {
            await api.delete(`goals/${id}/`);
            setGoals(goals.filter(g => g.id !== id));
        } catch (err) {
            console.error("Failed to delete goal", err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') addGoal();
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Trophy size={20} color={type === 'long-term' ? '#ff006e' : '#3a86ff'} />
                <h3>{title}</h3>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Add a ${title.toLowerCase()}...`}
                    style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        color: 'white',
                        outline: 'none'
                    }}
                />
                <button
                    onClick={addGoal}
                    className="neon-btn"
                    style={{ padding: '0.5rem' }}
                >
                    <Plus size={20} />
                </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {goals.map(goal => (
                    <li
                        key={goal.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            animation: 'fade-in 0.3s'
                        }}
                    >
                        <span>{goal.title}</span>
                        <button
                            onClick={() => deleteGoal(goal.id)}
                            style={{ background: 'transparent', color: '#ff006e', opacity: 0.7 }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </li>
                ))}
                {goals.length === 0 && (
                    <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.9rem' }}>No goals set yet. Aim high!</p>
                )}
            </ul>
        </div>
    );
}
