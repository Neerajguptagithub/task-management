import React from 'react';
import type { TaskStatus, TaskPriority } from '../../types';

interface BadgeProps {
  value: TaskStatus | TaskPriority;
  type?: 'status' | 'priority';
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const Badge: React.FC<BadgeProps> = ({ value }) => {
  return (
    <span className={`badge badge-${value}`}>
      {STATUS_LABELS[value as TaskStatus] || value}
    </span>
  );
};

export default Badge;
