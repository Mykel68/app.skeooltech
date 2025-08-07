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
  Download,
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

import { getFileTypeLabel, isValidHttpUrl } from "@/utils/helper";

/* ==================== API ==================== */
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

/* ==================== Component ==================== */
export default function MessageList() {
  /* ----------- UI state ----------- */
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  /* ----------- Store & query client ----------- */
  const schoolId = useUserStore((s) => s.schoolId!);
  const user = useUserStore((s) => s.firstName);
  const queryClient = useQueryClient();

  /* ----------- Data fetching ----------- */
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

  /* ----------- Mutations ----------- */
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

  /* ----------- Computed values ----------- */
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

  const selectedMessage = useMemo(
    () => messages.find((m: any) => m.message_id === selectedMessageId) || null,
    [messages, selectedMessageId]
  );

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

  /* ----------- Handlers ----------- */
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

  /* ----------- Render helpers ----------- */
  const renderMessageList = () => (
    <Card
      className={`${
        /* On desktop (lg) the card lives in a grid column */
        "lg:col-span-2"
      } flex flex-col h-full shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden`}
    >
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <h2 className="text-lg font-bold flex items-center space-x-2 text-gray-800">
          <Mail className="w-5 h-5 text-green-500" />
          <span>Inbox</span>
        </h2>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-y-auto">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {searchQuery ? "No matching messages" : "All caught up!"}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search terms or filters"
                : "You have no messages at the moment"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((message: any) => {
              const cfg = getCategoryConfig(message.message_type);
              const Icon = cfg.icon;
              const isSelected =
                selectedMessage?.message_id === message.message_id;

              return (
                <button
                  key={message.message_id}
                  className={`w-full text-left p-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border-l-4 group
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 border-l-green-500 shadow-md"
                        : `border-l-transparent ${
                            !message.isRead
                              ? "bg-gradient-to-r from-yellow-50 to-amber-50"
                              : "hover:border-l-green-200"
                          }`
                    }`}
                  onClick={() =>
                    handleMessageSelect(message.message_id, message.isRead)
                  }
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.bgColor} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`w-6 h-6 ${cfg.textColor}`} />
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
                          className={`text-xs ${cfg.bgColor} ${cfg.textColor} border-0`}
                        >
                          {cfg.label}
                        </Badge>
                        {message.target_role && (
                          <Badge variant="outline" className="text-xs">
                            {message.target_role}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {isValidHttpUrl(message.content) ? (
                          <span className="text-green-600 underline">
                            [{getFileTypeLabel(message.content)}]
                          </span>
                        ) : (
                          message.content
                        )}
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
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderMessageDetail = () => (
    <Card
      className={`${
        /* Desktop layout lives in col‑span‑3, mobile layout just flex‑1 */
        "lg:col-span-3"
      } flex flex-col h-full shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden`}
    >
      <CardContent className="flex-1 flex flex-col p-0 h-full">
        {selectedMessage ? (
          <>
            {/* Header – on mobile we also show a back button */}
            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100 flex items-start justify-between">
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

              {/* Status Badge */}
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

            {/* Category / Tags */}
            <div className="flex flex-wrap items-center gap-3 px-6 pt-4 pb-2">
              {(() => {
                const cfg = getCategoryConfig(selectedMessage.message_type);
                const Icon = cfg.icon;
                return (
                  <Badge
                    className={`${cfg.bgColor} ${cfg.textColor} px-3 py-1 text-sm border-0 flex items-center gap-1`}
                  >
                    <Icon className="w-4 h-4" />
                    {cfg.label}
                  </Badge>
                );
              })()}
              {selectedMessage.target_role && (
                <Badge
                  variant="outline"
                  className="px-3 py-1 flex items-center gap-1"
                >
                  <User className="w-4 h-4" />
                  {selectedMessage.target_role}
                </Badge>
              )}
              {selectedMessage.grade_level && (
                <Badge
                  variant="outline"
                  className="px-3 py-1 flex items-center gap-1"
                >
                  <BookOpen className="w-4 h-4" />
                  {selectedMessage.grade_level}
                </Badge>
              )}
              {/* Close (mobile) */}
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBackToList}
                  className="lg:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMessageId(null)}
                >
                  <X />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  deleteMessageMutation.mutate(selectedMessage.message_id)
                }
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete Message
              </Button>
            </div>

            {/* Message body */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose prose-lg max-w-none">
                {isValidHttpUrl(selectedMessage.content) ? (
                  renderPreview(selectedMessage.content)
                ) : (
                  <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {selectedMessage.content}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <MailOpen className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Select a message to read
              </h3>
              <p className="text-gray-600 max-w-md">
                Choose any message from your inbox to view its full content and
                details
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  /* ----------- UI rendering ----------- */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ---- Header ------------------------------------------------- */}
      <div className="max-w-8xl mx-auto w-full p-3 sm:p-4 lg:p-6">
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

        {/* ---- Filters ------------------------------------------------ */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-4">
              {/* Search bar */}
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

              {/* Filters */}
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

        {/* ---- Main content (list + detail) --------------------------- */}
        <div className="flex-1 flex overflow-hidden mt-4">
          {/* Desktop: side‑by‑side list + detail */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-6 h-full w-full">
            {renderMessageList()}
            {renderMessageDetail()}
          </div>

          {/* Mobile / Tablet: stacked view */}
          <div className="lg:hidden flex flex-col h-full w-full">
            {/* Mobile list */}
            {!showMobileDetail && renderMessageList()}

            {/* Mobile detail */}
            {showMobileDetail && selectedMessage && renderMessageDetail()}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- */
/* ---------- Preview component (unchanged) ----------------------- */
const renderPreview = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();

  if (!extension) return null;

  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
    return (
      <img
        src={url}
        alt="attachment"
        className="max-w-full rounded-lg border"
      />
    );
  }

  if (extension === "pdf") {
    return (
      <iframe
        src={url}
        className="w-full h-[500px] border rounded-lg"
        title="PDF Viewer"
      />
    );
  }

  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(extension)) {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          url
        )}`}
        className="w-full h-[500px] border rounded-lg"
        title="Office Document Viewer"
      />
    );
  }

  // Default fallback – just a link
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-600 hover:underline break-all"
    >
      {url}
    </a>
  );
};
