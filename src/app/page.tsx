// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground animate-in fade-in duration-1000">
      <div className="flex flex-col items-center transform transition-transform duration-500 hover:scale-105">
        <Image 
          src="/logo.png" 
          alt="Greenyleaf Logo" 
          width={120} 
          height={120} 
          priority 
          className="drop-shadow-lg"
        />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 mt-8 tracking-tight animate-in slide-in-from-bottom-4 duration-700 delay-150">
        Welcome to Greenyleaf
      </h1>
      <p className="text-lg md:text-xl text-center text-muted-foreground max-w-2xl px-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
        Track and reduce your carbon footprint with simple actions and personalized insights.
      </p>
      <Link 
        href="/dashboard" 
        className="mt-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-700 delay-500"
      >
        Get Started
      </Link>
    </div>
  );
}
