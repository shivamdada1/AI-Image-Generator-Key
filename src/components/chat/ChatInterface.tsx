import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { RunwareService, GeneratedImage } from "@/lib/runware";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  imageUrl?: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const runwareServiceRef = useRef<RunwareService | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!apiKey) {
      toast.error("Please enter your Runware API key");
      return;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsGenerating(true);

    try {
      if (!runwareServiceRef.current) {
        runwareServiceRef.current = new RunwareService(apiKey);
      }

      const response = await runwareServiceRef.current.generateImage({
        positivePrompt: message,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: "Here's your generated image:",
          isUser: false,
          imageUrl: response.imageURL,
        },
      ]);
    } catch (error) {
      console.error("Error generating image:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: "Sorry, I couldn't generate that image. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {!apiKey ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <h2 className="text-2xl font-semibold text-center">Welcome to AI Image Generator</h2>
            <p className="text-center text-muted-foreground">
              To get started, please enter your Runware API key. You can get one at{" "}
              <a
                href="https://runware.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                runware.ai
              </a>
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Runware API key"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-4">
                <div className="max-w-md space-y-2">
                  <h2 className="text-2xl font-semibold">AI Image Generator</h2>
                  <p className="text-muted-foreground">
                    Describe the image you want to create, and I'll generate it for you.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  imageUrl={message.imageUrl}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSend={handleSend} disabled={isGenerating} />
        </>
      )}
    </div>
  );
};