import { store } from "@/app/store"
import { SignupForm } from "@/components/signup-form"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

describe("SignupForm", () => {
  it("renders key auth elements", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupForm />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId("create-btn")).toBeInTheDocument()
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })
})
