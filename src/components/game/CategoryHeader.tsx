'use client';

interface CategoryHeaderProps {
  name: string;
}

export function CategoryHeader({ name }: CategoryHeaderProps) {
  return (
    <div className="bg-cell-bg rounded-lg p-3 md:p-4 text-center shadow-lg min-h-[60px] flex items-center justify-center">
      <h3 className="text-sm md:text-base lg:text-lg font-bold text-white uppercase tracking-wide leading-tight">
        {name || 'Category'}
      </h3>
    </div>
  );
}
