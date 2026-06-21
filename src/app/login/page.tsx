import { useState } from "react";
import type { FormEvent, ChangeEvent } from 'react'; // Added ChangeEvent
import { useRouter } from "next/navigation"; // This will work flawlessly now!
import { createBrowserClient } from "@/lib/supabase-browser-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Verified proper import
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        return;
      }
      router.refresh();
      router.push('/dashboard');
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          // Added ChangeEvent typing explicitly to get rid of implicit 'any' error
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          // Added ChangeEvent typing explicitly here too
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
export default LoginPage;