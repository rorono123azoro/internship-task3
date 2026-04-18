import React, { useState } from 'react';
import { Check, Edit2, Trash2, X, Save } from 'lucide-react';
import type { Todo } from '../../types/todo';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onUpdatePriority: (id: string, priority: Todo['priority']) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, onUpdatePriority }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={cn('todo-item animate-slide-down glass-panel', todo.completed && 'todo-completed')}>
      <div className="todo-header">
        <select 
          className={cn("priority-badge", `priority-${todo.priority}`)}
          value={todo.priority}
          onChange={(e) => onUpdatePriority(todo.id, e.target.value as Todo['priority'])}
          disabled={todo.completed}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <span className="todo-date">
          {new Date(todo.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div className="todo-content">
        <button 
          className={cn('checkbox', todo.completed && 'checkbox-checked')}
          onClick={() => onToggle(todo.id)}
        >
          {todo.completed && <Check size={16} />}
        </button>

        {isEditing ? (
          <div className="todo-edit-mode">
            <Input
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button size="icon" variant="ghost" onClick={handleEdit}>
              <Save size={18} className="text-success" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => { setIsEditing(false); setEditText(todo.text); }}>
              <X size={18} />
            </Button>
          </div>
        ) : (
          <span className={cn('todo-text', todo.completed && 'text-strikethrough')}>
            {todo.text}
          </span>
        )}

        {!isEditing && (
          <div className="todo-actions">
            <Button disabled={todo.completed} size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Edit2 size={18} />
            </Button>
            <Button size="icon" variant="danger" onClick={() => onDelete(todo.id)}>
              <Trash2 size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
