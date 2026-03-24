import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'shooping-todo-list';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Cannot load items from localStorage', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

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
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Shooping Todo</h1>

        <div style={styles.stats}>
          <span>{totalCount} total</span>
          <span>{doneCount} done</span>
          <span>{totalCount - doneCount} pending</span>
        </div>

        <div style={styles.inputLine}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Add a task e.g. 'Buy groceries'"
            aria-label="Task input"
          />
          <button style={styles.button} onClick={addItem}>
            {editingId !== null ? 'Update item' : 'Add item'}
          </button>
        </div>

        <div style={styles.filterRow}>
          {['all', 'todo', 'done'].map((value) => (
            <button
              key={value}
              style={
                filter === value
                  ? { ...styles.filterButton, ...styles.activeFilter }
                  : styles.filterButton
              }
              onClick={() => setFilter(value)}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
          <button style={styles.clearButton} onClick={clearAll} disabled={items.length === 0}>
            Clear All
          </button>
        </div>

        <ul style={styles.list}>
          {filtered.length === 0 ? (
            <li style={styles.empty}>No matching tasks. Add one above.</li>
          ) : (
            filtered.map((item) => (
              <li key={item.id} style={styles.item}>
                <label style={styles.itemLabel}>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleDone(item.id)}
                    style={styles.checkbox}
                    aria-label={`Mark ${item.text} as done`}
                  />
                  <span style={item.done ? styles.doneText : styles.normalText}>{item.text}</span>
                </label>
                <div style={styles.itemActions}>
                  <button style={styles.smallBtn} onClick={() => startEdit(item.id)}>
                    Edit
                  </button>
                  <button style={styles.smallBtnDanger} onClick={() => removeItem(item.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: '#fff',
    borderRadius: 20,
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
    padding: '1.5rem 1.25rem 1.25rem',
    marginTop: '1rem',
  },
  title: { marginBottom: '0.75rem', fontSize: '2rem', color: '#2d3748', textAlign: 'center' },
  stats: {
    display: 'flex',
    justifyContent: 'space-evenly',
    color: '#4a5568',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  inputLine: { display: 'flex', gap: '0.7rem', marginBottom: '1rem' },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid #d6dde6',
    borderRadius: 10,
    boxShadow: 'inset 0 1px 3px rgba(15, 23, 42, 0.06)',
  },
  button: {
    backgroundColor: '#1e40af',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '0.75rem 1.15rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(99, 102, 241, .25)',
  },
  filterRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' },
  filterButton: {
    padding: '0.4rem 0.8rem',
    border: '1px solid #cbd5e1',
    borderRadius: 12,
    background: '#f8fafc',
    color: '#334155',
    cursor: 'pointer',
  },
  activeFilter: {
    borderColor: '#1d4ed8',
    background: '#eff6ff',
    color: '#1d4ed8',
    fontWeight: 700,
  },
  clearButton: {
    marginLeft: 'auto',
    padding: '0.4rem 0.8rem',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    opacity: 1,
  },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  empty: {
    padding: '1rem',
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    border: '1px dashed #cbd5e1',
    borderRadius: 10,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e2e8f0',
    padding: '0.75rem 0',
  },
  itemLabel: { display: 'flex', alignItems: 'center', gap: '0.6rem', width: '80%' },
  checkbox: { width: 18, height: 18 },
  normalText: { color: '#1e293b', fontWeight: 600 },
  doneText: { color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 },
  itemActions: { display: 'flex', gap: '0.45rem' },
  smallBtn: {
    padding: '0.35rem 0.6rem',
    border: '1px solid #3b82f6',
    borderRadius: 8,
    background: '#dbeafe',
    color: '#1d4ed8',
    cursor: 'pointer',
    fontWeight: 700,
  },
  smallBtnDanger: {
    padding: '0.35rem 0.6rem',
    border: '1px solid #f87171',
    borderRadius: 8,
    background: '#fee2e2',
    color: '#b91c1c',
    cursor: 'pointer',
    fontWeight: 700,
  },
};

export default App;
