'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ className = '', variant = 'text', width, height }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    card: 'h-48 rounded-xl',
    text: 'h-4 rounded',
    circular: 'rounded-full',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3">
      <Skeleton variant="card" height={176} />
      <div className="mt-3 space-y-2">
        <Skeleton width="40%" height={12} />
        <Skeleton height={16} />
        <Skeleton width="60%" height={14} />
        <div className="flex gap-2 mt-2">
          <Skeleton width="50%" height={20} />
          <Skeleton width="30%" height={20} />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex justify-between mb-3">
        <Skeleton width={100} height={20} />
        <Skeleton width={80} height={24} variant="circular" />
      </div>
      <div className="space-y-2">
        <div className="flex gap-3">
          <Skeleton width={48} height={48} variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton height={14} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton width="20%" height={16} />
            <Skeleton width="30%" height={16} />
            <Skeleton width="15%" height={16} />
            <Skeleton width="15%" height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}