import { useEffect, useState } from 'react';
import Image from 'next/image';

const loadingTexts = [
  "Checking if Kanye dropped...",
  "Searching the waves 🌊",
  "Finding the truth...",
  "Asking the real questions...",
  "Looking for new drops...",
];

export default function LoadingState() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-image">
          <Image
            src="/images/gifs/stare.gif"
            width={100}
            height={100}
            alt="Loading..."
            priority
          />
        </div>
        <div className="loading-text">
          {loadingTexts[textIndex]}
        </div>
      </div>

      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
        }

        .loading-content {
          text-align: center;
          animation: pulse 2s infinite;
        }

        .loading-image {
          margin-bottom: 20px;
        }

        .loading-text {
          font-family: VCR, sans-serif;
          font-size: 1.2rem;
          opacity: 0;
          animation: fadeInOut 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 