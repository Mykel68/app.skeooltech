"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import {
  Bell,
  BellRing,
  Search,
  Filter,
  Calendar,
  User,
  GraduationCap,
  AlertTriangle,
  PartyPopper,
  BookOpen,
  Mail,
  MailOpen,
  Clock,
  CheckCircle,
  Circle,
  ChevronDown,
  Sparkles,
  MessageCircle,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetchMessages = async (schoolId: string) => {
  const res = await axios.get(`/api/message/get/${schoolId}`);
  return res.data.data.messages;
};

const apiMarkAsRead = async (messageId: string) => {
  const { data } = await axios.post(`/api/message/read/${messageId}`, {});
  return data.data.result;
};

const apiDeleteMessage = async (messageId: string) => {
  const { data } = await axios.delete(`/api/message/remove/${messageId}`);
  return data.data.result;
};

export default function MessageList() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const schoolId = useUserStore((s) => s.schoolId!);
  const user = useUserStore((s) => s.firstName);
  const queryClient = useQueryClient();

  // Fetch messages
  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", schoolId],
    queryFn: () => fetchMessages(schoolId),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: apiMarkAsRead,
    onSuccess: (updatedMessage, messageId) => {
      queryClient.setQueryData(["messages", schoolId], (old: any[]) =>
        old?.map((m) => (m.message_id === messageId ? updatedMessage : m))
      );
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: apiDeleteMessage,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<any>(["messages", schoolId], (old: any[]) =>
        old?.filter((m) => m.message_id !== deletedId)
      );
      setSelectedMessageId(null);
    },
  });

  // Enhanced filtering with search
  const filteredMessages = useMemo(() => {
    return messages.filter((m: any) => {
      const matchesRead =
        filter === "all" ||
        (filter === "read" && m.isRead) ||
        (filter === "unread" && !m.isRead);
      const matchesCategory =
        categoryFilter === "all" || m.message_type === categoryFilter;
      const matchesSearch =
        searchQuery === "" ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRead && matchesCategory && matchesSearch;
    });
  }, [messages, filter, categoryFilter, searchQuery]);

  const unreadCount = messages.filter((m: any) => !m.isRead).length;

  const formatDate = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffTime = now.getTime() - messageDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;

    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        messageDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const selectedMessage = useMemo(
    () => messages.find((m: any) => m.message_id === selectedMessageId) || null,
    [messages, selectedMessageId]
  );

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getCategoryConfig = (category: string) => {
    const configs = {
      announcement: {
        icon: Bell,
        bgColor: "bg-info-soft",
        textColor: "text-info",
        label: "Announcement",
      },
      academic: {
        icon: GraduationCap,
        bgColor: "bg-academic-soft",
        textColor: "text-academic",
        label: "Academic",
      },
      event: {
        icon: PartyPopper,
        bgColor: "bg-event-soft",
        textColor: "text-event",
        label: "Event",
      },
      emergency: {
        icon: AlertTriangle,
        bgColor: "bg-emergency-soft",
        textColor: "text-emergency",
        label: "Emergency",
      },
    };
    return (
      configs[category as keyof typeof configs] || {
        icon: MessageCircle,
        bgColor: "bg-muted",
        textColor: "text-muted-foreground",
        label: category,
      }
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading your messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">Unable to load messages</h3>
              <p className="text-muted-foreground">
                Please check your connection and try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header with personalized greeting */}
        <Card className="bg-green-500 shadow-medium">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                  <h1 className="text-2xl font-bold text-primary-foreground">
                    {getGreeting()}, {user || "Student"}!
                  </h1>
                </div>
                <p className="text-primary-foreground/80">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread message${
                        unreadCount > 1 ? "s" : ""
                      }`
                    : "You're all caught up! 🎉"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Bell className="w-6 h-6 text-primary-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-soft">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters and Search */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="announcement">Announcements</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">Events</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground">
                  {filteredMessages.length} messages
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-400px)] min-h-[600px]">
          {/* Messages List */}
          <Card className="shadow-medium">
            <CardHeader className="pb-0">
              <h2 className="text-lg font-semibold flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Messages</span>
              </h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-y-auto h-full">
                {filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No messages found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search or filters"
                        : "You're all caught up!"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredMessages.map((message: any, index: number) => {
                      const config = getCategoryConfig(message.message_type);
                      const Icon = config.icon;

                      return (
                        <div
                          key={message.message_id}
                          className={`p-4 cursor-pointer transition-all duration-200 hover:bg-green-200 border-l-4 ${
                            selectedMessage?.message_id === message.message_id
                              ? "bg-primary-soft border-l-primary"
                              : `border-l-transparent ${
                                  !message.isRead ? "bg-accent/30" : ""
                                }`
                          }`}
                          onClick={() => {
                            setSelectedMessageId(message.message_id);
                            if (!message.isRead) {
                              markAsReadMutation.mutate(message.message_id);
                            }
                          }}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor}`}
                            >
                              <Icon className={`w-5 h-5 ${config.textColor}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  {!message.isRead && (
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft"></div>
                                  )}
                                  <h3
                                    className={`font-medium truncate ${
                                      !message.isRead
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {message.title}
                                  </h3>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(message.created_at)}
                                </span>
                              </div>

                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {config.label}
                                </Badge>
                                {message.target_role && (
                                  <Badge variant="outline" className="text-xs">
                                    {message.target_role}
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {message.content}
                              </p>

                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(message.created_at)}
                                </span>
                                {message.isRead ? (
                                  <CheckCircle className="w-4 h-4 text-success" />
                                ) : (
                                  <Circle className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card className="shadow-medium">
            <CardContent className="p-0 h-full">
              {selectedMessage ? (
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b bg-gradient-card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-2">
                          {selectedMessage.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(selectedMessage.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTime(selectedMessage.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedMessage.isRead ? (
                          <Badge
                            variant="secondary"
                            className="bg-success-soft text-success"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Read
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-warning-soft text-warning"
                          >
                            <Circle className="w-3 h-3 mr-1" />
                            Unread
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      {(() => {
                        const config = getCategoryConfig(
                          selectedMessage.message_type
                        );
                        const Icon = config.icon;
                        return (
                          <Badge
                            className={`${config.bgColor} ${config.textColor}`}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        );
                      })()}
                      {selectedMessage.target_role && (
                        <Badge variant="outline">
                          <User className="w-3 h-3 mr-1" />
                          {selectedMessage.target_role}
                        </Badge>
                      )}
                      {selectedMessage.grade_level && (
                        <Badge variant="outline">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {selectedMessage.grade_level}
                        </Badge>
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedMessageId(null)}
                      >
                        <X />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (selectedMessage) {
                            deleteMessageMutation.mutate(
                              selectedMessage.message_id
                            );
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {selectedMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <MailOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Select a message
                      </h3>
                      <p className="text-muted-foreground">
                        Choose a message from the list to view its content
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
