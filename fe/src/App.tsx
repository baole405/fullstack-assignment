import { Toaster } from "@/components/ui/sonner"
import { AppRoutes } from "./routes/route.index"
import { AuthProvider } from "/contexts/AuthProvider"

const TITLE = "FE-devsamurai"

function App() {
  return (
    <AuthProvider>
      <title>{TITLE}</title>
      <Toaster position="top-right" />
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
