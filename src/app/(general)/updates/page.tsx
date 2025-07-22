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
  Menu,
  ArrowLeft,
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
  const [showMobileDetail, setShowMobileDetail] = useState(false);

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
      setShowMobileDetail(false);
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
        bgColor: "bg-green-50 dark:bg-green-950/30",
        textColor: "text-green-600 dark:text-green-400",
        label: "Announcement",
      },
      message: {
        icon: GraduationCap,
        bgColor: "bg-purple-50 dark:bg-purple-950/30",
        textColor: "text-purple-600 dark:text-purple-400",
        label: "Academic",
      },
      urgent: {
        icon: PartyPopper,
        bgColor: "bg-pink-50 dark:bg-pink-950/30",
        textColor: "text-pink-600 dark:text-pink-400",
        label: "Event",
      },
      newsletter: {
        icon: AlertTriangle,
        bgColor: "bg-red-50 dark:bg-red-950/30",
        textColor: "text-red-600 dark:text-red-400",
        label: "Emergency",
      },
    };
    return (
      configs[category as keyof typeof configs] || {
        icon: MessageCircle,
        bgColor: "bg-gray-50 dark:bg-gray-800",
        textColor: "text-gray-600 dark:text-gray-400",
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

  const handleMessageSelect = (messageId: string, isRead: boolean) => {
    setSelectedMessageId(messageId);
    setShowMobileDetail(true);
    if (!isRead) {
      markAsReadMutation.mutate(messageId);
    }
  };

  const handleBackToList = () => {
    setShowMobileDetail(false);
    setSelectedMessageId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Loading your messages
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch your latest updates...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">
                  Connection Error
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We couldn't load your messages. Please check your internet
                  connection and try again.
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-8xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Enhanced Header */}
        <Card className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-2xl border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <CardHeader className="pb-4 sm:pb-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {getGreeting()}, {user || "Student"}!
                  </h1>
                </div>
                <p className="text-white/90 text-sm sm:text-base font-medium">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread message${
                        unreadCount > 1 ? "s" : ""
                      } waiting for you`
                    : "You're all caught up! Great job staying organized 🎉"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">
                    {messages.length}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <div className="flex items-center space-x-2 bg-red-500 rounded-full px-4 py-2 shadow-lg animate-pulse">
                    <BellRing className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">{unreadCount}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Filters */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search messages by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all duration-200 rounded-xl text-base"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-200 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Filters:
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-full sm:w-32 bg-white border-gray-200 hover:border-blue-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="unread">Unread Only</SelectItem>
                        <SelectItem value="read">Read Only</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200 hover:border-blue-300">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="announcement">
                          📢 Announcements
                        </SelectItem>
                        <SelectItem value="message">📧 Messages</SelectItem>
                        <SelectItem value="notices">📌 Notices</SelectItem>
                        <SelectItem value="newsletter">
                          📰 Newsletter
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                    {filteredMessages.length} messages
                  </span>
                  {searchQuery && (
                    <Badge variant="outline" className="text-xs">
                      Filtered
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Layout */}
        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-6 h-[calc(100vh-400px)] min-h-[600px]">
            {/* Messages List - Takes 2/5 of the width */}
            <Card className="lg:col-span-2 shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden ">
              <CardHeader className="pb-3 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <h2 className="text-lg font-bold flex items-center space-x-2 text-gray-800">
                  <Mail className="w-5 h-5 text-green-500" />
                  <span>Inbox</span>
                </h2>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto">
                <div className="overflow-y-auto h-full">
                  {filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                        <Mail className="w-10 h-10 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">
                        {searchQuery
                          ? "No matching messages"
                          : "All caught up!"}
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery
                          ? "Try adjusting your search terms or filters"
                          : "You have no messages at the moment"}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredMessages.map((message: any, index: number) => {
                        const config = getCategoryConfig(message.message_type);
                        const Icon = config.icon;
                        const isSelected =
                          selectedMessage?.message_id === message.message_id;

                        return (
                          <div
                            key={message.message_id}
                            className={`p-4 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border-l-4 group ${
                              isSelected
                                ? "bg-gradient-to-r from-green-100 to-emerald-100 border-l-green-500 shadow-md"
                                : `border-l-transparent ${
                                    !message.isRead
                                      ? "bg-gradient-to-r from-yellow-50 to-amber-50"
                                      : "hover:border-l-green-200"
                                  }`
                            }`}
                            onClick={() =>
                              handleMessageSelect(
                                message.message_id,
                                message.isRead
                              )
                            }
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor} group-hover:scale-110 transition-transform duration-200`}
                              >
                                <Icon
                                  className={`w-6 h-6 ${config.textColor}`}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    {!message.isRead && (
                                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                                    )}
                                    <h3
                                      className={`font-semibold truncate ${
                                        !message.isRead
                                          ? "text-gray-900"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {message.title}
                                    </h3>
                                  </div>
                                  <span className="text-xs text-gray-500 font-medium">
                                    {formatTime(message.created_at)}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2 mb-3">
                                  <Badge
                                    className={`text-xs ${config.bgColor} ${config.textColor} border-0`}
                                  >
                                    {config.label}
                                  </Badge>
                                  {message.target_role && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {message.target_role}
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                  {message.content}
                                </p>

                                <div className="flex items-center justify-between mt-3">
                                  <span className="text-xs text-gray-500 font-medium">
                                    {formatDate(message.created_at)}
                                  </span>
                                  {message.isRead ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-400" />
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

            {/* Message Detail - Takes 3/5 of the width */}
            <Card className="lg:col-span-3 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-0 h-full">
                {selectedMessage ? (
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold mb-3 text-gray-900 leading-tight">
                            {selectedMessage.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">
                                {formatDate(selectedMessage.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-green-500" />
                              <span className="font-medium">
                                {formatTime(selectedMessage.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {selectedMessage.isRead ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Read
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
                              <Circle className="w-3 h-3 mr-1" />
                              Unread
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {(() => {
                          const config = getCategoryConfig(
                            selectedMessage.message_type
                          );
                          const Icon = config.icon;
                          return (
                            <Badge
                              className={`${config.bgColor} ${config.textColor} px-3 py-1 text-sm border-0`}
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              {config.label}
                            </Badge>
                          );
                        })()}
                        {selectedMessage.target_role && (
                          <Badge variant="outline" className="px-3 py-1">
                            <User className="w-4 h-4 mr-2" />
                            {selectedMessage.target_role}
                          </Badge>
                        )}
                        {selectedMessage.grade_level && (
                          <Badge variant="outline" className="px-3 py-1">
                            <BookOpen className="w-4 h-4 mr-2" />
                            {selectedMessage.grade_level}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
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
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Delete Message
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                      <div className="prose prose-lg max-w-none">
                        <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base">
                          {selectedMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                        <MailOpen className="w-12 h-12 text-green-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          Select a message to read
                        </h3>
                        <p className="text-gray-600 max-w-md">
                          Choose any message from your inbox to view its full
                          content and details
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden">
            {(!showMobileDetail || !selectedMessage) && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm h-[calc(100vh-300px)] min-h-[500px]">
                <CardHeader className="pb-3 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                  <h2 className="text-lg font-bold flex items-center space-x-2 text-gray-800">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span>Messages ({filteredMessages.length})</span>
                  </h2>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-y-auto h-full">
                    {filteredMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                          <Mail className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {searchQuery
                            ? "No matching messages"
                            : "All caught up!"}
                        </h3>
                        <p className="text-gray-600 text-center">
                          {searchQuery
                            ? "Try adjusting your search terms or filters"
                            : "You have no messages at the moment"}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredMessages.map((message: any, index: number) => {
                          const config = getCategoryConfig(
                            message.message_type
                          );
                          const Icon = config.icon;

                          return (
                            <div
                              key={message.message_id}
                              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 active:scale-[0.98] ${
                                !message.isRead
                                  ? "bg-gradient-to-r from-yellow-50 to-amber-50"
                                  : ""
                              }`}
                              onClick={() =>
                                handleMessageSelect(
                                  message.message_id,
                                  message.isRead
                                )
                              }
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor} flex-shrink-0`}
                                >
                                  <Icon
                                    className={`w-6 h-6 ${config.textColor}`}
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2 flex-1">
                                      {!message.isRead && (
                                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex-shrink-0"></div>
                                      )}
                                      <h3
                                        className={`font-semibold text-sm sm:text-base truncate ${
                                          message.isRead
                                            ? "text-gray-800"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        {message.title}
                                      </h3>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      {formatDate(message.created_at)}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {message.content}
                                  </p>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
