// BadgeBeta.tsx
// React + TypeScript component using TailwindCSS.
// Default export a reusable "Badge" you can place next to logos or anywhere.
// Props:
// - text: string (default: 'Beta')
// - size: 'sm' | 'md' | 'lg' (default: 'md')
// - color: 'red' | 'blue' | 'green' | 'gray' | 'amber' | 'purple' | 'custom' (default: 'red')
// - customColor: string (hex or any valid CSS color) used when color === 'custom'
// - variant: 'solid' | 'outline' | 'ghost' (default: 'solid')
// - as: string tag to render (default: 'span')
// - className: extra classes to apply
// - children: optional — if you want icon + badge inside wrapper

import React from 'react';

type Size = 'sm' | 'md' | 'lg';
type ColorKey = 'red' | 'blue' | 'green' | 'gray' | 'amber' | 'purple' | 'custom';

type Props = {
  text?: string;
  size?: Size;
  color?: ColorKey;
  customColor?: string; // only used when color === 'custom'
  variant?: 'solid' | 'outline' | 'ghost';
  className?: string;
  children?: React.ReactNode;
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-[10px] px-2 py-[2px] rounded-full',
  md: 'text-xs px-2.5 py-[4px] rounded-full',
  lg: 'text-sm px-3 py-1 rounded-full',
};

const colorMap: Record<Exclude<ColorKey, 'custom'>, {bg: string; text: string; ring?: string}> = {
  red: { bg: 'bg-red-600', text: 'text-white' },
  blue: { bg: 'bg-blue-600', text: 'text-white' },
  green: { bg: 'bg-green-600', text: 'text-white' },
  gray: { bg: 'bg-gray-500', text: 'text-white' },
  amber: { bg: 'bg-amber-500', text: 'text-white' },
  purple: { bg: 'bg-purple-600', text: 'text-white' },
};

export default function BadgeBeta({
  text = 'Beta',
  size = 'md',
  color = 'red',
  customColor,
  variant = 'solid',
  className = '',
  children,
}: Props) {
  // base classes
  const sizeCls = sizeClasses[size];

  // compute color classes
  let styleAttr: React.CSSProperties | undefined = undefined;
  let classes = '';

  if (color === 'custom' && customColor) {
    // using inline style for custom color (solid variant)
    if (variant === 'solid') {
      styleAttr = { backgroundColor: customColor, color: '#fff' };
    } else if (variant === 'outline') {
      styleAttr = { borderColor: customColor, color: customColor, backgroundColor: 'transparent' };
    } else if (variant === 'ghost') {
      styleAttr = { color: customColor, backgroundColor: 'transparent' };
    }
    // always add border for outline
    classes = `border ${sizeCls} inline-flex items-center justify-center ${className}`.trim();
  } else {
    const cmap = colorMap[color as Exclude<ColorKey, 'custom'>];
    if (variant === 'solid') {
      classes = `${cmap.bg} ${cmap.text} ${sizeCls} inline-flex items-center justify-center ${className}`.trim();
    } else if (variant === 'outline') {
      classes = `border ${cmap.bg.replace('bg-', 'border-')} bg-transparent ${cmap.bg.replace('bg-', 'text-')} ${sizeCls} inline-flex items-center justify-center ${className}`.trim();
    } else {
      // ghost: colored text only
      classes = `${cmap.bg.replace('bg-', 'text-')} ${sizeCls} inline-flex items-center justify-center bg-transparent ${className}`.trim();
    }
  }

  // Added glow effect via Tailwind drop-shadow and optional glow color\n  const glowColor = color === 'custom' && customColor ? customColor : undefined;\n  const glowStyle = glowColor ? { filter: `drop-shadow(0 0 6px ${glowColor})` } : {};\n  const mergedStyle = { ...(styleAttr || {}), ...(glowStyle || {}) };\n\n  return (
    const glowColor = color === 'custom' && customColor ? customColor : undefined;
    const glowStyle = glowColor ? { filter: `drop-shadow(0 0 6px ${glowColor})` } : {};
    const mergedStyle = { ...(styleAttr || {}), ...(glowStyle || {}) };  
  return (
    <span
      className={classes}
      style={mergedStyle}
      aria-label={`badge ${text}`}
    >
      {/* Optional children (e.g., icon) then text */}
      {children}
      {children ? <span className="ml-1">{text}</span> : <>{text}</>}
    </span>
  );
}

/*
Usage examples (Tailwind + Next.js):

1) Next to a logo:

<div className="flex items-center gap-2">
  <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
  <BadgeBeta text="Beta" />
</div>

2) As a small corner ribbon (put relative on parent):

<div className="relative inline-block">
  <img src="/logo.svg" alt="Logo" className="h-12 w-12" />
  <div className="absolute -top-2 -right-2">
    <BadgeBeta text="New" size="sm" color="amber" />
  </div>
</div>

3) Custom color & outline:
<BadgeBeta text="Staging" color="custom" customColor="#6b21a8" variant="outline" />

4) With icon (using react-icons):
<BadgeBeta text="Beta" size="sm" color="blue"> <SomeIcon size={12} /> </BadgeBeta>

If you want I can:
- Add an automatic "corner ribbon" variation (diagonal) that clips to the corner.
- Create a CSS-module or styled-components version instead of Tailwind.
- Export TypeScript prop types separately.
*/
