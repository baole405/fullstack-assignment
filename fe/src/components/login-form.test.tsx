import { store } from "@/app/store"
import { LoginForm } from "@/components/login-form"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

describe("LoginForm", () => {
  it("renders key auth elements", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId("login-btn")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
  })
})
