
import React from 'react';

interface LoaderProps {
  message?: string;
  subMessage?: string;
  size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ 
  message = "Logging out...", 
  subMessage = "",
  size = 'small'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className="text-center flex flex-col items-center justify-center">
      {/* Custom Loader */}
      <div className="mb-4">
        <div 
          className={`${sizeClasses[size]} relative border-4 border-amber-100 inline-block loader-container`}
        >
          <div className="loader-inner w-full bg-amber-100"></div>
        </div>
      </div>
      
      {message && (
        <h2 className="text-amber-100 font-tektur text-3xl font-bold">
          {message}
        </h2>
      )}
      
      {subMessage && (
        <p className="text-amber-100 font-tektur text-lg mt-2">
          {subMessage}
        </p>
      )}

      <style>{`
        .loader-container {
          animation: loader 2s infinite ease;
        }

        .loader-inner {
          vertical-align: top;
          display: inline-block;
          animation: loader-inner 2s infinite ease-in;
        }

        @keyframes loader {
          0% {
            transform: rotate(0deg);
          }
          
          25% {
            transform: rotate(180deg);
          }
          
          50% {
            transform: rotate(180deg);
          }
          
          75% {
            transform: rotate(360deg);
          }
          
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes loader-inner {
          0% {
            height: 0%;
          }
          
          25% {
            height: 0%;
          }
          
          50% {
            height: 100%;
          }
          
          75% {
            height: 100%;
          }
          
          100% {
            height: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;