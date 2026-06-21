"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react"; // Explicit type imports
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase-browser-client";
// FIX: Unified and corrected local shadcn component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterPage = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // FIX: Modern direct 'redirectTo' assignment inside options
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/register/confirm`,
          // If you have metadata like username, pass it here:
          data: { display_name: username } 
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Automatically push to dashboard or a confirmation notice screen
      router.push('/dashboard');
    } catch (err) {
      setError("An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // FIX: Standard semantic form tag matching login layout
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* FIX: Handled with tailwind classes directly instead of missing ErrorMessage element */}
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterPage;