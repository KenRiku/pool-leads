import { Navbar } from "@/components/navbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}
