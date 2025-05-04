import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const systemPrompt = `Je bent een behulpzame assistent voor het MisstandMelder platform, een gratis, open-source platform om misstanden in Nederland (zoals corruptie, bureaucratie, gebrek aan menselijkheid) te melden via Google Reviews. 
    
    Help de gebruiker bij het formuleren van een duidelijke en effectieve melding. Vraag naar details zoals:
    - Waar vond het incident plaats?
    - Wanneer gebeurde het?
    - Wie was erbij betrokken?
    - Wat is er precies gebeurd?
    
    Geef advies over hoe ze hun ervaring kunnen delen op Google Maps en help hen bij het opstellen van een objectieve review.
    
    Antwoord in het Nederlands tenzij de gebruiker in een andere taal communiceert.`

    const lastMessage = messages[messages.length - 1].content

    const { text } = await generateText({
      model: xai("grok"),
      prompt: lastMessage,
      system: systemPrompt,
      messages: messages.slice(0, -1).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
