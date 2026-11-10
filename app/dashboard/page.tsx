"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { clearTokens } from "@/lib/auth";
import { CONFIG } from "@/lib/config";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress,ProgressLabel,ProgressValue, } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type UserData = {
  name?: string;
  avatarUrl?: string;
} | null;

export function ProgressWithLabel() {
  return (
    <Progress value={56} className="w-full max-w-sm">
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}

export default function DashboardPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: true });
  const [user, setUser] = useState<UserData>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem("user");
    router.push(CONFIG.ROUTES.LOGIN);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background text-foreground transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={user?.avatarUrl || "me.png"} 
                alt={user?.name || "User avatar"} 
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome{user?.name ? `, ${user.name}` : " back"}!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
  
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800">
              Authenticated
            </Badge>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <Alert>
          <AlertTitle>Welcome back!</AlertTitle>
          <AlertDescription>
            You are authenticated. Your active JWT session is stored in localStorage.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Session Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Active</p>
              <p className="text-xs text-muted-foreground mt-1">Verified & valid</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Security Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">High</p>
              <p className="text-xs text-muted-foreground mt-1">JWT authentication</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">80%</p>
              <Progress value={80} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Separator />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your account at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Storage</span>
                  <span>localStorage</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary">Ready</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Manage your session & preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.name && (
                  <p className="text-muted-foreground">
                    Logged in as: <strong className="text-foreground">{user.name}</strong>
                  </p>
                )}
                <p className="text-muted-foreground">
                  Your session is currently active. To end your session, click Logout below.
                </p>
                <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                  Sign Out Now
                </Button>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Session data will be cleared from your browser
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
