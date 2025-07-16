import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
      {children && <div>{children}</div>}
    </div>
  );
}
