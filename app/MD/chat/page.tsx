"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Plus, Image, Search } from "lucide-react";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const contacts = [
    {
      id: 1,
      name: "John Doe",
      avatar: "JD",
      lastMessage: "Could you share some screenshots?",
      timestamp: "09:33 AM",
      unread: 2,
      status: "online",
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "SS",
      lastMessage: "The presentation looks great!",
      timestamp: "09:15 AM",
      unread: 0,
      status: "offline",
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "MJ",
      lastMessage: "Let's schedule a meeting",
      timestamp: "Yesterday",
      unread: 1,
      status: "online",
    },
    {
      id: 4,
      name: "Emily Brown",
      avatar: "EB",
      lastMessage: "Thanks for your help!",
      timestamp: "Yesterday",
      unread: 0,
      status: "offline",
    },
  ];

  // Sample messages for demonstration
  const messages: {
    [key: number]: Array<{
      id: number;
      sender: string;
      content: string;
      timestamp: string;
      isSent: boolean;
    }>;
  } = {
    1: [
      {
        id: 1,
        sender: "John Doe",
        content: "Hey, how's the new project coming along?",
        timestamp: "09:30 AM",
        isSent: false,
      },
      {
        id: 2,
        sender: "You",
        content:
          "Making good progress! Just finished the initial design phase.",
        timestamp: "09:32 AM",
        isSent: true,
      },
      {
        id: 3,
        sender: "John Doe",
        content:
          "That's great to hear! Could you share some screenshots of what you've done so far?",
        timestamp: "09:33 AM",
        isSent: false,
      },
    ],
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const selectedContactData = contacts.find((c) => c.id === selectedContact);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto p-6">
        <Card className="h-[600px] flex bg-white shadow-lg">
          {/* Contacts Sidebar */}
          <div className="w-80 border-r flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Contacts List */}
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedContact === contact.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {contact.avatar}
                          </span>
                        </div>
                        {contact.status === "online" && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">
                            {contact.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {contact.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {contact.lastMessage}
                        </p>
                      </div>
                      {contact.unread > 0 && (
                        <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3 bg-white">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {selectedContactData?.avatar}
                </span>
              </div>
              <div>
                <h2 className="font-semibold">{selectedContactData?.name}</h2>
                <span className="text-xs text-gray-500">
                  {selectedContactData?.status === "online"
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages[selectedContact]?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isSent ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        msg.isSent
                          ? "bg-blue-500 text-white rounded-t-2xl rounded-l-2xl"
                          : "bg-gray-100 text-gray-800 rounded-t-2xl rounded-r-2xl"
                      } p-3 shadow-sm`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span
                        className={`text-xs mt-1 block ${
                          msg.isSent ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => console.log("Add attachment")}
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => console.log("Add image")}
                >
                  <Image className="h-5 w-5" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 shrink-0"
                  onClick={handleSend}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default ChatInterface;
