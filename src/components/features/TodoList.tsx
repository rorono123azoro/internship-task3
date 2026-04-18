import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useTodos } from '../../hooks/useTodos';
import { TodoItem } from './TodoItem';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import './TodoList.css';

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, updatePriority } = useTodos();
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addTodo(inputText);
      setInputText('');
    }
  };

  const filteredAndSortedTodos = useMemo(() => {
    let result = todos;
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    return result.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityScore = { high: 3, medium: 2, low: 1 };
        const scoreDiff = priorityScore[b.priority] - priorityScore[a.priority];
        if (scoreDiff !== 0) return scoreDiff;
      }
      return b.createdAt - a.createdAt;
    });
  }, [todos, filter, sortBy]);

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return (
    <div className="todo-container glass-panel">
      <div className="todo-header-main">
        <h1 className="text-gradient">Task Master</h1>
        <p className="todo-subtitle">Stay organized, focused, and productive.</p>
      </div>

      <div className="todo-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Uses</span>
        </div>
        <div className="stat-card">
          <span className="stat-number text-warning">{stats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card">
          <span className="stat-number text-success">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <form onSubmit={handleAdd} className="todo-input-group">
        <Input 
          placeholder="What needs to be done?" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button type="submit">
          <Plus size={20} /> Add
        </Button>
      </form>

      <div className="todo-controls">
        <div className="filter-group">
          <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'active' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('active')}>Active</Button>
          <Button variant={filter === 'completed' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('completed')}>Completed</Button>
        </div>
        
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      <div className="todo-list">
        {filteredAndSortedTodos.length === 0 ? (
          <div className="todo-empty">
            <p>No tasks found. Time to relax! ✨</p>
          </div>
        ) : (
          filteredAndSortedTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              onUpdatePriority={updatePriority}
            />
          ))
        )}
      </div>
    </div>
  );
}
