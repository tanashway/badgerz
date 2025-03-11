"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, Info, Calendar, Trophy, Clock, HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  model?: string;
  isError?: boolean;
};

const suggestedQuestions = [
  "When is our next game?",
  "What was the score of our last game?",
  "What's our current record?",
  "When and where are practices held?",
  "Who is the top scorer on the team?",
  "When is the summer tournament?",
  "Who are the coaches?",
  "What time should we arrive for games?"
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm BadgersBot, your Badgers 2014 team assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call API to get bot response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add bot response to chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: "bot",
        timestamp: new Date(),
        model: data.model,
      };

      setMessages((prev) => [...prev, botMessage]);
      
      // Check if this is a fallback response
      if (data.model && data.model.includes('Fallback')) {
        setShowApiWarning(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. I can still answer basic questions about the team schedule, record, and practices, but my detailed knowledge is limited until the connection is restored.",
        sender: "bot",
        timestamp: new Date(),
        isError: true
      };

      setMessages((prev) => [...prev, errorMessage]);
      setShowApiWarning(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 order-2 md:order-1">
          <Card className="h-[calc(100vh-10rem)]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-primary text-primary-foreground">BB</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">BadgersBot</CardTitle>
                    <CardDescription>Your team assistant (Powered by OpenAI)</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              {showApiWarning && (
                <Alert variant="warning" className="m-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Limited Functionality</AlertTitle>
                  <AlertDescription>
                    The AI service is currently experiencing connection issues. Basic team information is still available, but detailed responses may be limited.
                  </AlertDescription>
                </Alert>
              )}
              <ScrollArea className="h-[calc(100vh-16rem)] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.isError
                            ? "bg-muted border border-destructive/50"
                            : "bg-muted"
                        }`}
                      >
                        {message.isError && (
                          <div className="flex items-center mb-2 text-destructive">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Connection Issue</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.model && (
                          <div className="mt-1 text-xs opacity-70 text-right">
                            {message.model}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <Separator />
            <CardFooter className="p-4">
              <div className="flex w-full items-center space-x-2">
                <Input
                  ref={inputRef}
                  placeholder="Type your question here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="md:w-80 order-1 md:order-2">
          <Tabs defaultValue="questions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="info">Team Info</TabsTrigger>
            </TabsList>
            <TabsContent value="questions" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Suggested Questions</CardTitle>
                  <CardDescription>Try asking BadgersBot about:</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => handleSendMessage(question)}
                      disabled={isLoading}
                    >
                      <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{question}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="info" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Team Information</CardTitle>
                  <CardDescription>Quick reference for team details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center mb-1">
                      <Trophy className="h-4 w-4 mr-2" />
                      Current Record
                    </h3>
                    <p className="text-sm pl-6">8-2-1 (Wins-Losses-Ties)</p>
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Next Game
                    </h3>
                    <p className="text-sm pl-6">June 15, 2025, 10:00 AM vs. Wildcats FC (Home)</p>
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center mb-1">
                      <Clock className="h-4 w-4 mr-2" />
                      Practice Schedule
                    </h3>
                    <p className="text-sm pl-6">Tuesdays & Thursdays, 5:30 PM - 7:00 PM</p>
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center mb-1">
                      <Info className="h-4 w-4 mr-2" />
                      About BadgersBot
                    </h3>
                    <p className="text-sm pl-6">
                      BadgersBot can answer questions about team schedules, game results, player stats, and more. Try asking about upcoming games, practice times, or team policies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}