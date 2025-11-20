import React from 'react';

export default function Button({ children, className = '', icon: Icon, variant, ...props }) {
  const base = 'px-4 py-2 rounded font-medium transition';
  const variantClass =
    variant === 'success'
      ? 'bg-green-600 text-white hover:bg-green-700'
      : variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <button className={`${base} ${variantClass} ${className}`} {...props}>
      {Icon && <Icon size={16} className="inline mr-2" />}
      {children}
    </button>
  );
}
