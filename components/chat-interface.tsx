"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Send, User } from "lucide-react"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welkom bij MisstandMelder. Hoe kan ik u helpen bij het melden van een misstand?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const systemPrompt = `Je bent een behulpzame assistent voor het MisstandMelder platform, een gratis, open-source platform om misstanden in Nederland (zoals corruptie, bureaucratie, gebrek aan menselijkheid) te melden via Google Reviews. 
      
      Help de gebruiker bij het formuleren van een duidelijke en effectieve melding. Vraag naar details zoals:
      - Waar vond het incident plaats?
      - Wanneer gebeurde het?
      - Wie was erbij betrokken?
      - Wat is er precies gebeurd?
      
      Geef advies over hoe ze hun ervaring kunnen delen op Google Maps en help hen bij het opstellen van een objectieve review.
      
      Antwoord in het Nederlands tenzij de gebruiker in een andere taal communiceert.`

      const { text } = await generateText({
        model: xai("grok"),
        prompt: userMessage,
        system: systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      })

      setMessages((prev) => [...prev, { role: "assistant", content: text }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Er is een fout opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-3xl h-[600px] border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-start max-w-[80%]">
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mr-2">
                  <img src="/misstandmelder-logo.png" alt="MisstandMelder" />
                </Avatar>
              )}
              <Card className={`${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <CardContent className="p-3">{message.content}</CardContent>
              </Card>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 ml-2">
                  <User className="h-5 w-5" />
                </Avatar>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-muted">
              <CardContent className="p-3">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Typ uw bericht..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
