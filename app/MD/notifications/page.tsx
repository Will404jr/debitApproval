"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  MessageSquare,
  Settings,
  FileText,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "message",
      title: "New Message",
      content: "Sarah sent you a message about the project deadline",
      time: "2 minutes ago",
      unread: true,
      icon: MessageSquare,
    },
    {
      id: 2,
      type: "alert",
      title: "System Alert",
      content: "Server maintenance scheduled for tonight at 2 AM",
      time: "1 hour ago",
      unread: true,
      icon: AlertCircle,
    },
    {
      id: 3,
      type: "document",
      title: "Document Shared",
      content: 'Alex shared "Q4 Report.pdf" with you',
      time: "3 hours ago",
      unread: false,
      icon: FileText,
    },
    {
      id: 4,
      type: "settings",
      title: "Settings Updated",
      content: "Your account settings were updated successfully",
      time: "1 day ago",
      unread: false,
      icon: Settings,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white shadow-lg">
        <CardHeader className="border-b">
          <div className="w-full bg-gradient-to-r from-blue-600 to-green-400 h-1 absolute top-0 left-0 right-0" />
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6 text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-blue-600"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="h-[400px]">
          <CardContent className="p-0">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`
                    relative p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors
                    ${notification.unread ? "bg-blue-50/50" : ""}
                  `}
                >
                  {notification.unread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                  )}
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      rounded-full p-2 
                      ${
                        notification.unread
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              notification.unread
                                ? "text-blue-600"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.content}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {notification.time}
                          </span>
                          {notification.unread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-gray-400 hover:text-blue-600 h-6 px-2"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-blue-600 ml-2"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </ScrollArea>

        <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {unreadCount === 0
              ? "No unread notifications"
              : `${unreadCount} unread notification${
                  unreadCount === 1 ? "" : "s"
                }`}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-blue-600"
          >
            View All
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotificationsPanel;
