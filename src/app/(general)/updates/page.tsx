"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fake API for demo — replace with your real functions
const fetchMessages = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return [
    {
      id: "1",
      subject: "Welcome!",
      content: "Hello there.",
      sender: { name: "Admin", role: "admin" },
      sentAt: new Date().toISOString(),
      isRead: false,
      priority: "high",
      category: "announcement",
    },
  ];
};

const markAsRead = async (id) => {
  await new Promise((r) => setTimeout(r, 200));
  console.log(`Marked ${id} as read`);
};

const deleteMessage = async (id) => {
  await new Promise((r) => setTimeout(r, 200));
  console.log(`Deleted ${id}`);
};

export default function MessageList() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
    staleTime: 5 * 60 * 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["messages"], (old) =>
        old?.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["messages"], (old) =>
        old?.filter((m) => m.id !== id)
      );
      if (selectedMessage?.id === id) setSelectedMessage(null);
    },
  });

  const filteredMessages = messages.filter((m) => {
    const matchesRead =
      filter === "all" ||
      (filter === "read" && m.isRead) ||
      (filter === "unread" && !m.isRead);
    const matchesCategory =
      categoryFilter === "all" || m.category === categoryFilter;
    return matchesRead && matchesCategory;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getPriorityColor = (priority) =>
    priority === "high"
      ? "text-red-600"
      : priority === "medium"
      ? "text-yellow-600"
      : "text-green-600";

  const getCategoryBadge = (category) => {
    const colors = {
      announcement: "bg-green-100 text-green-800",
      academic: "bg-purple-100 text-purple-800",
      event: "bg-green-100 text-green-800",
      emergency: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Error loading messages.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto ">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white p-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-green-100 mt-1">
            View announcements and updates from school administration
          </p>
        </div>

        <div className="p-4 border-b bg-gray-50 flex gap-4 items-center flex-wrap">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All</option>
              <option value="announcement">Announcements</option>
              <option value="academic">Academic</option>
              <option value="event">Events</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-600">
            {filteredMessages.length} messages
          </div>
        </div>

        <div className="flex h-[600px]">
          <div className="w-1/2 border-r overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="text-center text-gray-500 p-8">
                No messages found
              </div>
            ) : (
              <div className="divide-y">
                {filteredMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === m.id
                        ? "bg-green-50 border-r-4 border-green-600"
                        : ""
                    } ${!m.isRead ? "bg-green-25" : ""}`}
                    onClick={() => {
                      setSelectedMessage(m);
                      if (!m.isRead) markAsReadMutation.mutate(m.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {!m.isRead && (
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          )}
                          <h3
                            className={`text-sm font-medium truncate ${
                              !m.isRead ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {m.subject}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs text-gray-600">
                            {m.sender.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getCategoryBadge(
                              m.category
                            )}`}
                          >
                            {m.category}
                          </span>
                          <span
                            className={`text-xs font-medium ${getPriorityColor(
                              m.priority
                            )}`}
                          >
                            {m.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {m.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(m.sentAt)}
                          </span>
                          {m.attachments?.length ? (
                            <span className="text-xs text-gray-500 flex items-center">
                              📎 {m.attachments.length}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-1/2 flex flex-col">
            {selectedMessage ? (
              <>
                <div className="p-6 border-b bg-gray-50 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>From: {selectedMessage.sender.name}</span>
                      <span>Role: {selectedMessage.sender.role}</span>
                      <span>{formatDate(selectedMessage.sentAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getCategoryBadge(
                          selectedMessage.category
                        )}`}
                      >
                        {selectedMessage.category}
                      </span>
                      <span
                        className={`text-xs font-medium ${getPriorityColor(
                          selectedMessage.priority
                        )}`}
                      >
                        {selectedMessage.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      deleteMessageMutation.mutate(selectedMessage.id)
                    }
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete message"
                  >
                    🗑️
                  </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {selectedMessage.content}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">📬</div>
                  <p>Select a message to view its content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
