"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Plus, Image, Search } from "lucide-react";
import Pusher from "pusher-js";
import { type User, users } from "@/lib/user";
import { useRouter } from "next/navigation";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<{
    [key: string]: Array<{
      id: number;
      sender: string;
      content: string;
      timestamp: string;
      isSent: boolean;
    }>;
  }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/session");
      const session = await response.json();
      if (session.isLoggedIn && session.username) {
        const user = users.find((u) => u.username === session.username);
        if (user) {
          setCurrentUser(user);
        }
      } else {
        // Redirect to login page if not logged in
        router.push("/login");
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && selectedContact) {
        const response = await fetch(
          `/api/get-messages?userId=${currentUser.id}&otherUserId=${selectedContact.id}`
        );
        if (response.ok) {
          const fetchedMessages = await response.json();
          setMessages((prevMessages) => ({
            ...prevMessages,
            [selectedContact.id]: fetchedMessages.map((msg: any) => ({
              id: msg._id,
              sender:
                msg.senderId === currentUser.id
                  ? currentUser.username
                  : selectedContact.username,
              content: msg.message,
              timestamp: new Date(msg.timestamp).toLocaleTimeString(),
              isSent: msg.senderId === currentUser.id,
            })),
          }));
        }
      }
    };
    fetchMessages();
  }, [currentUser, selectedContact]);

  useEffect(() => {
    if (!currentUser) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });

    const channel = pusher.subscribe(`private-user-${currentUser.id}`);
    channel.bind("new-message", (data: { sender: User; message: string }) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [data.sender.id]: [
          ...(prevMessages[data.sender.id] || []),
          {
            id: Date.now(),
            sender: data.sender.username,
            content: data.message,
            timestamp: new Date().toLocaleTimeString(),
            isSent: false,
          },
        ],
      }));
    });

    return () => {
      pusher.unsubscribe(`private-user-${currentUser.id}`);
    };
  }, [currentUser]);

  const filteredContacts = users.filter(
    (user) =>
      user.id !== currentUser?.id &&
      (currentUser?.personnelType === "Md" || user.personnelType === "Md") &&
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async () => {
    if (message.trim() && selectedContact && currentUser) {
      const newMessage = {
        senderId: currentUser.id,
        recipientId: selectedContact.id,
        message: message,
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await fetch("/api/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedContact.id]: [
            ...(prevMessages[selectedContact.id] || []),
            {
              id: Date.now(),
              sender: currentUser.username,
              content: message,
              timestamp: new Date().toLocaleTimeString(),
              isSent: true,
            },
          ],
        }));

        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        // You might want to show an error message to the user here
      }
    }
  };

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
                      selectedContact?.id === contact.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {contact.username.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {contact.username}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {contact.personnelType}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            {selectedContact && (
              <div className="p-4 border-b flex items-center gap-3 bg-white">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {selectedContact.username.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold">{selectedContact.username}</h2>
                  <span className="text-xs text-gray-500">
                    {selectedContact.personnelType}
                  </span>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedContact &&
                  messages[selectedContact.id]?.map((msg) => (
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
