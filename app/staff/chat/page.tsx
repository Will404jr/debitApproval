"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Plus, Image } from "lucide-react";

const ChatInterface = () => {
  const [message, setMessage] = useState("");

  // Sample messages for demonstration
  const [messages] = useState([
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
      content: "Making good progress! Just finished the initial design phase.",
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
    {
      id: 4,
      sender: "You",
      content: "Sure thing! I'll gather them and send them over in a bit.",
      timestamp: "09:35 AM",
      isSent: true,
    },
    {
      id: 5,
      sender: "John Doe",
      content:
        "That's great to hear! Could you share some screenshots of what you've done so far?",
      timestamp: "09:33 AM",
      isSent: false,
    },
    {
      id: 6,
      sender: "You",
      content: "Sure thing! I'll gather them and send them over in a bit.",
      timestamp: "09:35 AM",
      isSent: true,
    },
    {
      id: 7,
      sender: "John Doe",
      content:
        "That's great to hear! Could you share some screenshots of what you've done so far?",
      timestamp: "09:33 AM",
      isSent: false,
    },
    {
      id: 8,
      sender: "You",
      content: "Sure thing! I'll gather them and send them over in a bit.",
      timestamp: "09:35 AM",
      isSent: true,
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="h-[600px] flex flex-col bg-white shadow-lg">
        {/* Chat Header */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-green-400 h-1 absolute top-0 left-0 right-0" />
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-green-400 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">MD</span>
            </div>
            <div>
              <h2 className="font-semibold text-white">Managing Director</h2>
              <span className="text-xs text-white/80">Online</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isSent ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.isSent
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-2xl rounded-l-2xl"
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
      </Card>
    </div>
  );
};

export default ChatInterface;
