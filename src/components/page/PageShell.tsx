import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
}

interface SectionHeadingProps {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
}

export function PageShell({ children, className = '' }: PageShellProps) {
  return <div className={`p-8 max-w-7xl mx-auto ${className}`.trim()}>{children}</div>;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  actions,
  className = '',
  titleClassName = 'text-4xl font-black tracking-tighter',
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${className}`.trim()}>
      <div className="space-y-2">
        <h1 className={`flex items-center gap-3 ${titleClassName}`.trim()}>
          {icon}
          {title}
        </h1>
        {subtitle ? <p className="text-zinc-500 text-lg">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-4">{actions}</div> : null}
    </div>
  );
}

export function SectionHeading({ 
  title, 
  icon, 
  actions, 
  className = '', 
  titleClassName = 'text-xl font-bold' 
}: SectionHeadingProps) {
  return (
    <div className={`flex items-center justify-between ${className}`.trim()}>
      <h2 className={`flex items-center gap-2 ${titleClassName}`.trim()}>
        {icon}
        {title}
      </h2>
      {actions}
    </div>
  );
}
