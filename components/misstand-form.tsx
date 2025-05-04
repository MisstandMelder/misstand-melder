"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Loader2, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Naam moet minimaal 2 karakters bevatten.",
  }),
  institution: z.string().min(2, {
    message: "Instelling moet minimaal 2 karakters bevatten.",
  }),
  category: z.string({
    required_error: "Selecteer een categorie.",
  }),
  types: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Selecteer minimaal één type misstand.",
  }),
  description: z.string().min(10, {
    message: "Beschrijving moet minimaal 10 karakters bevatten.",
  }),
  impact: z.string().min(10, {
    message: "Impact moet minimaal 10 karakters bevatten.",
  }),
})

const typeOptions = [
  {
    id: "corruptie",
    label: "Corruptie",
  },
  {
    id: "bureaucratie",
    label: "Bureaucratie",
  },
  {
    id: "belangenverstrengeling",
    label: "Belangenverstrengeling",
  },
  {
    id: "vriendjespolitiek",
    label: "Vriendjespolitiek",
  },
  {
    id: "gebrek-aan-menselijkheid",
    label: "Gebrek aan menselijkheid",
  },
]

export function MisstandForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedReview, setGeneratedReview] = useState("")
  const [activeTab, setActiveTab] = useState("form")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      institution: "",
      types: [],
      description: "",
      impact: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate AI generation
    setTimeout(() => {
      const typesText = values.types
        .map((type) => {
          const option = typeOptions.find((opt) => opt.id === type)
          return option ? option.label.toLowerCase() : type
        })
        .join(", ")

      setGeneratedReview(
        `Mijn ervaring met ${values.institution} was teleurstellend. Ik heb te maken gehad met ${typesText} wat een grote impact had: ${values.impact}. Concreet ging het om het volgende: ${values.description}. Ik deel deze ervaring om bij te dragen aan verbetering van het systeem.`,
      )
      setIsSubmitting(false)
      setActiveTab("preview")
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedReview)
      .then(() => {
        alert("Review gekopieerd naar klembord!")
      })
      .catch((err) => {
        console.error("Kon niet kopiëren:", err)
      })
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="form">Formulier</TabsTrigger>
        <TabsTrigger value="preview" disabled={!generatedReview}>
          Resultaat
        </TabsTrigger>
      </TabsList>

      <TabsContent value="form">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naam of pseudoniem</FormLabel>
                    <FormControl>
                      <Input placeholder="Bijv. Jan Jansen of Burger X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instelling</FormLabel>
                    <FormControl>
                      <Input placeholder="Bijv. Zaans Medisch Centrum, Gemeente Zaanstad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kies een categorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="overheid">Overheid</SelectItem>
                      <SelectItem value="zorg">Zorg</SelectItem>
                      <SelectItem value="onderwijs">Onderwijs</SelectItem>
                      <SelectItem value="bedrijfsleven">Bedrijfsleven</SelectItem>
                      <SelectItem value="overig">Overig</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="types"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Type misstand</FormLabel>
                    <FormDescription>Selecteer alle types die van toepassing zijn.</FormDescription>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {typeOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="types"
                        render={({ field }) => {
                          return (
                            <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(field.value?.filter((value) => value !== option.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschrijving</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Beschrijf wat er gebeurd is..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impact</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Welke impact had dit op jou of anderen?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Review genereren...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Genereer Review
                </>
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="preview">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {form.getValues().name.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{form.getValues().name}</p>
                  <p className="text-sm text-muted-foreground">Over {form.getValues().institution}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-5 w-5 fill-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Gepost op {new Date().toLocaleDateString()}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="whitespace-pre-line">{generatedReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setActiveTab("form")}>
            Terug naar formulier
          </Button>
          <Button onClick={copyToClipboard}>Kopieer naar klembord</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
