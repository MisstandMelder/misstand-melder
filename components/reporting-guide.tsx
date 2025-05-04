"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export function ReportingGuide() {
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [generatedReport, setGeneratedReport] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    if (!location || !date || !description) return

    setIsGenerating(true)
    try {
      const { text } = await generateText({
        model: xai("grok"),
        prompt: `Genereer een objectieve Google Review voor de volgende situatie:
        
        Locatie: ${location}
        Datum: ${date}
        Beschrijving: ${description}
        
        Maak een duidelijke, feitelijke en respectvolle review die de situatie goed beschrijft en die nuttig is voor anderen.`,
        system: `Je bent een assistent die helpt bij het opstellen van effectieve meldingen van misstanden voor het MisstandMelder platform. Genereer een objectieve Google Review op basis van de gegeven informatie. De review moet feitelijk, duidelijk en respectvol zijn.`,
      })

      setGeneratedReport(text)
    } catch (error) {
      console.error("Error generating report:", error)
      setGeneratedReport("Er is een fout opgetreden bij het genereren van de melding. Probeer het later opnieuw.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedReport)
      .then(() => alert("Melding gekopieerd naar klembord!"))
      .catch((err) => console.error("Kon niet kopiëren:", err))
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Misstand Melden</CardTitle>
        <CardDescription>Vul de details in om een effectieve melding te genereren</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="form">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Formulier</TabsTrigger>
            <TabsTrigger value="result">Resultaat</TabsTrigger>
          </TabsList>
          <TabsContent value="form" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="location">Locatie</Label>
              <Input
                id="location"
                placeholder="Bijv. Gemeente Amsterdam, Zaans Medisch Centrum"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Datum</Label>
              <Input id="date" placeholder="Bijv. 15 mei 2023" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beschrijving van de situatie</Label>
              <Textarea
                id="description"
                placeholder="Beschrijf wat er is gebeurd, wie erbij betrokken was, en hoe het u heeft beïnvloed..."
                className="min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating || !location || !date || !description}
              className="w-full"
            >
              {isGenerating ? "Genereren..." : "Genereer Melding"}
            </Button>
          </TabsContent>
          <TabsContent value="result" className="mt-4">
            {generatedReport ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-muted">
                  <p className="whitespace-pre-wrap">{generatedReport}</p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={copyToClipboard} variant="outline">
                    Kopieer naar klembord
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Vul het formulier in en genereer een melding om het resultaat hier te zien.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">Deze tool helpt u bij het opstellen van een objectieve melding.</p>
      </CardFooter>
    </Card>
  )
}
