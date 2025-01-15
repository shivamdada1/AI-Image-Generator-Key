import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  imageUrl?: string;
}

export const ChatMessage = ({ message, isUser, imageUrl }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4 transition-all",
        isUser ? "bg-chat-user/5" : "bg-chat-bot/5"
      )}
    >
      <div className="flex-1 space-y-4">
        <p className="text-sm leading-relaxed">{message}</p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded-lg shadow-lg max-w-full h-auto fade-in"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};