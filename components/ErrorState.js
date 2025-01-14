import Image from 'next/image';

export default function ErrorState({ error }) {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-image">
          <Image
            src="/images/gifs/blank-stare.gif"
            width={100}
            height={100}
            alt="Error"
            priority
          />
        </div>
        <h1 className="error-title">Oops! Something went wrong</h1>
        <p className="error-message">
          {error || "We couldn't load the data. Please try again later."}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Try Again
        </button>
      </div>

      <style jsx>{`
        .error-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
        }

        .error-content {
          text-align: center;
          padding: 2rem;
          max-width: 500px;
        }

        .error-image {
          margin-bottom: 20px;
        }

        .error-title {
          font-family: VCR, sans-serif;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #ff0015;
        }

        .error-message {
          font-family: VCR, sans-serif;
          font-size: 1rem;
          margin-bottom: 2rem;
          color: #666;
        }

        .retry-button {
          font-family: VCR, sans-serif;
          background: black;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .retry-button:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
} 