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
import { Sun, Moon,  } from "lucide-react";

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
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <header className="flex justify-between items-center pb-3 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user?.avatarUrl || "me.png"} 
                alt={user?.name || "User avatar"} 
              />
              <AvatarFallback className="bg-card text-foreground text-sm">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome{user?.name ? `, ${user.name}` : " back"}!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-full"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Badge 
              variant="outline" 
              className="bg-emerald-950/40 text-emerald-400 border-emerald-800/50 text-xs px-2 py-0.5 h-auto"
            >
              Authenticated
            </Badge>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="h-8 px-3 text-xs bg-red-950/40 text-red-400 border border-red-800/50 hover:bg-red-900/30 hover:text-red-300"
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Welcome Alert */}
        <Alert className="bg-card/40 border-border/40 py-3">
          <AlertTitle className="text-sm font-medium">Welcome back!</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground mt-0.5">
            You are authenticated. Your active JWT session is stored in localStorage.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/40 border-border/40 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Session Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">Active</p>
              <p className="text-xs text-muted-foreground mt-1">Verified & valid</p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-border/40 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Security Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">High</p>
              <p className="text-xs text-muted-foreground mt-1">JWT authentication</p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-border/40 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">80%</p>
              <Progress value={80} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-border/40 my-2" />

        {/* Tabs — Content BELOW */}
        <Tabs defaultValue="overview" className="w-full flex flex-col">
          {/* Tab Buttons Row */}
          <TabsList className="grid w-full grid-cols-2 bg-transparent border border-border/40 p-0 h-9 rounded-md overflow-hidden">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none rounded-l-md h-full text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="account"
              className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none rounded-r-md h-full text-sm"
            >
              Account
            </TabsTrigger>
          </TabsList>
          
          {/* Content — DIRECTLY BELOW TABS, full width */}
          <div className="mt-4 w-full">
            <TabsContent value="overview" className="mt-0 w-full">
              <Card className="bg-card/40 border-border/40 shadow-none w-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overview</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Your account at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="text-xs">localStorage</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="text-xs px-2 py-0 h-6 bg-muted">Ready</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="mt-0 w-full">
              <Card className="bg-card/40 border-border/40 shadow-none w-full">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Account Details</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Manage your session & preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user?.name && (
                    <p className="text-muted-foreground text-sm">
                      Logged in as: <strong className="text-foreground">{user.name}</strong>
                    </p>
                  )}
                  <p className="text-muted-foreground text-sm">
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
          </div>
        </Tabs>
      </div>
    </div>
  );
}
