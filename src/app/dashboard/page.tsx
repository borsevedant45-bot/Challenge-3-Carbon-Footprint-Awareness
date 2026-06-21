"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Added for redirection
import { createBrowserClient } from "@/lib/supabase-browser-client";
// FIX: Corrected individual shadcn component paths
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 

const DashboardPage = () => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Explicit loading state
  const supabase = createBrowserClient();
  const router = useRouter();

  useEffect(() => {
    // FIX: Modern Supabase auth listener destructuring
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          router.push("/"); // Boot them to login if they aren't auth'd
        }
        setIsLoading(false);
      }
    );

    return () => {
      // FIX: Modern clean up method
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener above will handle clearing state & redirection automatically!
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-medium">
            Welcome, <span className="text-primary">{user?.email}</span>
          </p>
          <Button onClick={handleSignOut} variant="destructive" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;