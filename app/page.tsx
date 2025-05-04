import { MisstandForm } from "@/components/misstand-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Image
            src="/misstandmelder-logo.png"
            alt="MisstandMelder Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="font-bold text-xl">MisstandMelder</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="container pb-16">
        <section className="mx-auto max-w-4xl py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">MisstandMelder</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Een gratis platform om misstanden in Nederland aan te kaarten via krachtige Google Reviews
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="rounded-full">
              Begin direct
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Meer informatie
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-3xl rounded-xl border bg-card p-6 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Maak je Google Review</h2>
            <p className="mt-2 text-muted-foreground">
              Documenteer je ervaring en gebruik gratis AI om een constructieve, kritische review te maken die
              systeemfouten blootlegt.
            </p>
          </div>

          <MisstandForm />
        </section>
      </main>

      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Image
              src="/misstandmelder-logo.png"
              alt="MisstandMelder Logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} MisstandMelder. Open-source platform.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/misstandmelder/misstand-melder"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              GitHub
            </a>
            <a href="#" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
