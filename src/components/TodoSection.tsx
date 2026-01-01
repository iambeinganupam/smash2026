import { useState, useEffect } from 'react';
import { Plus, Check, Square, Trash2, CheckSquare } from 'lucide-react';
import api from '../api/axios';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export default function TodoSection() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await api.get('todos/');
            setTodos(response.data);
        } catch (err) {
            console.error("Failed to fetch todos", err);
        }
    };

    const addTodo = async () => {
        if (!inputValue.trim()) return;
        try {
            const response = await api.post('todos/', {
                text: inputValue.trim(),
                completed: false
            });
            setTodos([...todos, response.data]);
            setInputValue('');
        } catch (err) {
            console.error("Failed to add todo", err);
        }
    };

    const toggleTodo = async (id: number) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        try {
            // Optimistic update locally
            const updatedTodos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
            setTodos(updatedTodos);

            await api.patch(`todos/${id}/`, {
                completed: !todo.completed
            });
        } catch (err) {
            console.error("Failed to toggle todo", err);
            // Revert if failed
            setTodos(todos);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            await api.delete(`todos/${id}/`);
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            console.error("Failed to delete todo", err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') addTodo();
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckSquare size={20} color="#4cc9f0" />
                <h3>Daily Todos</h3>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="What needs to be done?"
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
                    onClick={addTodo}
                    className="neon-btn"
                    style={{ padding: '0.5rem', background: 'linear-gradient(135deg, #4cc9f0, #4361ee)' }}
                >
                    <Plus size={20} />
                </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '300px', overflowY: 'auto' }}>
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            background: todo.completed ? 'rgba(76, 201, 240, 0.1)' : 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <button
                            onClick={() => toggleTodo(todo.id)}
                            style={{ background: 'transparent', color: todo.completed ? '#4cc9f0' : 'rgba(255,255,255,0.5)', marginRight: '0.75rem' }}
                        >
                            {todo.completed ? <Check size={20} /> : <Square size={20} />}
                        </button>

                        <span style={{
                            flex: 1,
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? '#a0a0a0' : 'white'
                        }}>
                            {todo.text}
                        </span>

                        <button
                            onClick={() => deleteTodo(todo.id)}
                            style={{ background: 'transparent', color: '#ff006e', opacity: 0.7 }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </li>
                ))}
                {todos.length === 0 && (
                    <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.9rem' }}>All caught up!</p>
                )}
            </ul>
        </div>
    );
}
