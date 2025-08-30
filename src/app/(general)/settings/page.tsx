"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/store/userStore";
import { useLogout } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const role = useUserStore((s) => s.role);
  const email = useUserStore((s) => s.email);
  const username = useUserStore((s) => s.username);
  const router = useRouter();
  const logout = useLogout();

  const handleLinkAction = () => {
    if (role === "Student") {
      router.push("/student/generate-code");
    } else {
      router.push("/parent/link");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Account Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Role:</strong> {role}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {role === "Student"
              ? "Generate a secure code for your parent to link to your account."
              : "Link to your child's account using their generated code."}
          </p>
          <Button className="w-full" onClick={handleLinkAction}>
            {role === "Student"
              ? "Generate Linking Code for Parent"
              : "Link to Your Child’s Account"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span>Email Notifications</span>
          <Switch defaultChecked />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        Log Out
      </Button>
    </div>
  );
}
