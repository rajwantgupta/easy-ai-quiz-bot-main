
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChatIcon, Send } from "@/components/ui/icons";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Message = {
  id: string;
  content: string;
  sender: "user" | "support";
  timestamp: Date;
};

const SupportChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load chat history from localStorage when component mounts
  useEffect(() => {
    if (user) {
      try {
        const savedMessages = localStorage.getItem(`chat-${user.id}`);
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          // Convert string timestamps back to Date objects
          const formattedMessages = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }
  }, [user]);
  
  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chat-${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);
  
  // Scroll to bottom whenever messages change or chat is opened
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add welcome message when opening an empty chat
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: "Hello! How can we help you today?",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to a support system
      await new Promise(resolve => setTimeout(resolve, 1500)); // simulate delay
      
      // Generate a response
      const supportMessage: Message = {
        id: `support-${Date.now()}`,
        content: getAutoResponse(message),
        sender: "support",
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, supportMessage]);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAutoResponse = (userMessage: string) => {
    const lowercaseMsg = userMessage.toLowerCase();
    
    if (lowercaseMsg.includes("quiz") || lowercaseMsg.includes("test")) {
      return "For any quiz related questions, please reach out to your administrator. They can help you with quiz assignments and results.";
    } else if (lowercaseMsg.includes("password") || lowercaseMsg.includes("login")) {
      return "If you're having trouble with your password or login, please try resetting your password from the login page. If the issue persists, contact your administrator.";
    } else if (lowercaseMsg.includes("certificate")) {
      return "Certificates are automatically generated when you pass a quiz. You can view and share your certificates from your dashboard.";
    } else if (lowercaseMsg.includes("thank")) {
      return "You're welcome! If you have any other questions, feel free to ask.";
    } else {
      return "Thanks for your message. Our support team will review it and get back to you soon. For urgent matters, please contact your administrator directly.";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="h-12 w-12 rounded-full shadow-lg"
          aria-label="Support Chat"
        >
          <ChatIcon />
        </Button>
      </div>
      
      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96">
          <Card className="shadow-xl border-t-4 border-t-primary overflow-hidden">
            <div className="bg-primary text-white p-3">
              <div className="font-bold">Support Chat</div>
              <div className="text-xs opacity-75">
                We typically reply within a few hours
              </div>
            </div>
            
            <CardContent className="p-3 h-80 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block rounded-lg px-3 py-2 max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            
            <CardFooter className="p-2 border-t">
              <div className="flex w-full items-center">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 mr-2"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Send />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default SupportChat;
