import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, bgColor, subtitle }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: bgColor }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </p>
      <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
        {value}
      </p>
      {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{subtitle}</p>}
    </div>
  </div>
);

export default StatCard;
