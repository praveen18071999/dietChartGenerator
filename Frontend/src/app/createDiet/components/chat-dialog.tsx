"use client"

import type React from "react"

import { X, Send, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { MealItem } from "../hooks/use-diet-plan"

interface ChatDialogProps {
  showChatBot: boolean
  setShowChatBot: (show: boolean) => void
  selectedProfessional: string | null
  chatMessages: { role: string; content: string }[]
  messageInput: string
  setMessageInput: (input: string) => void
  handleChatSubmit: (e: React.FormEvent) => void
  shareDietPlan: () => void
}

export function ChatDialog({
  showChatBot,
  setShowChatBot,
  selectedProfessional,
  chatMessages,
  messageInput,
  setMessageInput,
  handleChatSubmit,
  shareDietPlan,
}: ChatDialogProps) {
  return (
    <Dialog open={showChatBot} onOpenChange={setShowChatBot}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-purple-200">
                <AvatarImage
                  src={
                    selectedProfessional === "doctor"
                      ? "/placeholder.svg?height=40&width=40"
                      : "/placeholder.svg?height=40&width=40"
                  }
                />
                <AvatarFallback
                  className={
                    selectedProfessional === "doctor" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }
                >
                  {selectedProfessional === "doctor" ? "DR" : "TR"}
                </AvatarFallback>
              </Avatar>
              <DialogTitle className="text-xl">
                {selectedProfessional === "doctor" ? "Dr. Smith" : "Alex (Trainer)"}
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-lg">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleChatSubmit} className="flex gap-3">
            <Textarea
              placeholder="Type your message..."
              className="min-h-[60px] resize-none text-lg"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                size="icon"
                className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white"
              >
                <Send className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full border-2"
                onClick={shareDietPlan}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

