import React, { useState } from 'react';
import { FiImage } from 'react-icons/fi';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
  customIcon?: React.ReactNode;
}

const Image: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackClassName, 
  customIcon,
  ...props 
}) => {
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  if (imgError) {
    const combinedClassName = `block bg-gray-100 dark:bg-gray-800 ${className || ''} ${fallbackClassName || ''}`;
    
    return (
      <div className={combinedClassName} {...props}>
        {customIcon || <FiImage className="w-12 h-12 text-gray-400 dark:text-gray-600" />}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt || 'Image'} 
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default Image;