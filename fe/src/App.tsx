import { useAppDispatch } from "@/app/hooks"
import { Toaster } from "@/components/ui/sonner"
import { verifySessionThunk } from "@/features/validation/auth.slice"
import { useEffect } from "react"
import { AppRoutes } from "./routes/route.index"

const TITLE = "FE-devsamurai"

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = TITLE
    void dispatch(verifySessionThunk())
  }, [dispatch])

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  )
}

export default App
