// src/components/common/SectionTitle.tsx
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export default function SectionTitle({ 
  title, 
  subtitle, 
  center = false, 
  className = '' 
}: SectionTitleProps) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className={`h-1 w-20 bg-indigo-600 mt-4 ${center ? 'mx-auto' : ''}`}></div>
    </div>
  );
}