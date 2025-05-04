import { ReportingGuide } from "@/components/reporting-guide"

export default function ReportPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex items-center mb-8">
            <img src="/misstandmelder-logo.png" alt="MisstandMelder Logo" className="h-16 w-16 mr-3" />
            <h1 className="text-3xl font-bold">Misstand Melden</h1>
          </div>
          <p className="text-center mb-8 max-w-2xl">
            Gebruik dit formulier om een misstand te melden. De AI-assistent zal u helpen bij het opstellen van een
            effectieve melding.
          </p>
          <ReportingGuide />
        </div>
      </div>
    </main>
  )
}
