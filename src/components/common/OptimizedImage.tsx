// src/components/common/OptimizedImage.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.FC<any> | null;
  fallbackClassName?: string;
  loadingComponent?: React.ReactNode;
  lazyLoad?: boolean;
  blurHash?: string;
  placeholderColor?: string;
}

/**
 * OptimizedImage - A robust image component with:
 * - Loading states
 * - Error handling with fallbacks
 * - Animation support
 * - Blur-up loading effect option
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  fallbackIcon = null,
  fallbackClassName = "",
  loadingComponent = null,
  lazyLoad = true,
  blurHash = "",
  placeholderColor = "#f3f4f6", // gray-100
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>(lazyLoad ? '' : src);
  
  // Handle placeholder and blurHash
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  
  // For lazy loading
  useEffect(() => {
    if (lazyLoad) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      }, { rootMargin: '200px' });
      
      const currentRef = document.getElementById(`image-${src.replace(/[^a-zA-Z0-9]/g, '')}`);
      if (currentRef) {
        observer.observe(currentRef);
      }
      
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }
  }, [src, lazyLoad]);
  
  // Generate default SVG fallback if no fallbackIcon provided
  const DefaultFallback = () => (
    <div className={`w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${fallbackClassName}`}>
      <ImageOff 
        size={32} 
        className="text-gray-400 dark:text-gray-600" 
      />
    </div>
  );
  
  // Create placeholder background
  const placeholderStyle = {
    backgroundColor: placeholderColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  // Handle blur hash if provided
  if (blurHash) {
    placeholderStyle.backgroundImage = `url(${blurHash})`;
  }
  
  // Handle rendering the fallback content
  const renderFallback = () => {
    if (!fallbackIcon) {
      return <DefaultFallback />;
    }
    
    // If fallbackIcon is a function, call it
    if (typeof fallbackIcon === 'function') {
      return fallbackIcon();
    }
    
    // Otherwise, render it as a component
    return <div className="w-full h-full flex items-center justify-center">
      <ImageOff size={32} className="text-gray-400 dark:text-gray-600" />
    </div>;
  };
  
  return (
    <div 
      id={`image-${src.replace(/[^a-zA-Z0-9]/g, '')}`}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Show placeholder while loading */}
      {showPlaceholder && !imageError && (
        <div className="absolute inset-0 z-10" style={placeholderStyle}>
          {loadingComponent || (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          )}
        </div>
      )}
      
      {/* Actual image */}
      {!imageError ? (
        <motion.img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100 z-20' : 'opacity-0 z-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onLoad={() => {
            setImageLoaded(true);
            setShowPlaceholder(false);
          }}
          onError={() => {
            setImageError(true);
            setShowPlaceholder(false);
          }}
          loading={lazyLoad ? "lazy" : "eager"}
        />
      ) : (
        // Fallback when image fails to load
        <div className="w-full h-full z-20">
          {renderFallback()}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;