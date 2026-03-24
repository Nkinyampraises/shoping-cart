import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'shooping-todo-list';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedTheme = localStorage.getItem('shooping-theme');
      if (stored) {
        setItems(JSON.parse(stored));
      }
      if (storedTheme) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error('Cannot load settings from localStorage', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('shooping-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addItem = () => {
    const text = input.trim();
    if (!text) return;

    if (editingId !== null) {
      setItems((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, text } : item))
      );
      setEditingId(null);
    } else {
      const exists = items.some((item) => item.text.toLowerCase() === text.toLowerCase());
      if (exists) {
        window.alert('Item already exists. Please use a different name.');
        return;
      }
      setItems((prev) => [...prev, { id: Date.now(), text, done: false }]);
    }

    setInput('');
  };

  const toggleDone = (id) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const startEdit = (id) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    setInput(target.text);
    setEditingId(id);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setInput('');
    }
  };

  const clearAll = () => {
    if (items.length === 0) return;
    if (!window.confirm('Clear all items?')) return;
    setItems([]);
    setEditingId(null);
    setInput('');
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter === 'done') return item.done;
      if (filter === 'todo') return !item.done;
      return true;
    });
  }, [items, filter]);

  const doneCount = items.filter((item) => item.done).length;
  const totalCount = items.length;

  return (
    <div className="page"> 
      <header className="topbar">
        <div className="brand">Shooping</div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#todo">Todo</a>
          <a href="#about">About</a>
        </nav>
        <button className="themeToggle" onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="content">
        <section id="home" className="hero">
          <h1>Well Structured Todo Web App</h1>
          <p>Track tasks, stay focused, and ship quickly with a modern React UI.</p>
          <a href="#todo" className="cta">Get Started</a>
        </section>

        <section id="todo" className="card">
          <div className="statsBar">
            <span>{totalCount} tasks</span>
            <span>{doneCount} completed</span>
            <span>{totalCount - doneCount} pending</span>
          </div>

          <div className="inputRow">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="Add a task..." 
              aria-label="Task input"
            />
            <button onClick={addItem}>{editingId !== null ? 'Update' : 'Add'}</button>
          </div>

          <div className="filterRow">
            {['all', 'todo', 'done'].map((value) => (
              <button
                key={value}
                className={filter === value ? 'active' : ''}
                onClick={() => setFilter(value)}
              >
                {value}
              </button>
            ))}
            <button className="danger" onClick={clearAll} disabled={items.length === 0}>
              Clear All
            </button>
          </div>

          <ul className="taskList">
            {filtered.length === 0 ? (
              <li className="empty">No tasks found. Add your first task above.</li>
            ) : (
              filtered.map((item) => (
                <li key={item.id} className="taskItem">
                  <label>
                    <input type="checkbox" checked={item.done} onChange={() => toggleDone(item.id)} />
                    <span className={item.done ? 'done' : ''}>{item.text}</span>
                  </label>
                  <div className="actions">
                    <button className="edit" onClick={() => startEdit(item.id)}>Edit</button>
                    <button className="delete" onClick={() => removeItem(item.id)}>Delete</button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section id="about" className="infoCard">
          <h2>About This Project</h2>
          <ul>
            <li>React functional components with hooks</li>
            <li>Local storage persistence</li>
            <li>Responsive layout with theme toggle</li>
            <li>Structured sections and smooth navigation</li>
          </ul>
        </section>
      </main>

      <footer className="footer">Shooping App © {new Date().getFullYear()}</footer>
    </div>
  );
}

export default App;
