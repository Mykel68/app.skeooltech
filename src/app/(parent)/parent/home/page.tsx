"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";
import LinkChildPage from "../../link/page";
import ParentDashboard from "./ParentDashboard";

// Mock API functions
const mockApi = {
  checkParentStatus: async (): Promise<{
    hasChildren: boolean;
    isFirstLogin: boolean;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const hasChildren = localStorage.getItem("parentHasChildren") === "true";
    const isFirstLogin = localStorage.getItem("parentFirstLogin") !== "false";
    return { hasChildren, isFirstLogin };
  },

  loginParent: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem("parentLoggedIn", "true");
  },
};

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const queryClient = useQueryClient();

  const { data: parentStatus, isLoading } = useQuery({
    queryKey: ["parentStatus"],
    queryFn: mockApi.checkParentStatus,
    enabled: isLoggedIn,
  });

  const loginMutation = useMutation({
    mutationFn: mockApi.loginParent,
    onSuccess: () => {
      setIsLoggedIn(true);
      queryClient.invalidateQueries({ queryKey: ["parentStatus"] });
    },
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("parentLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    loginMutation.mutate();
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    queryClient.clear();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show link child page for first login or when no children are linked
  if (parentStatus?.isFirstLogin || !parentStatus?.hasChildren) {
    return (
      <LinkChildPage
        onChildLinked={() =>
          queryClient.invalidateQueries({ queryKey: ["parentStatus"] })
        }
      />
    );
  }

  return <ParentDashboard onLogout={handleLogout} />;
};

export default Index;
