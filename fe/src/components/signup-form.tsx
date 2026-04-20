import { useAppDispatch } from "@/app/hooks"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  signupSchema,
  type SignupFormValues,
} from "@/features/validation/auth.schema"
import { signupThunk } from "@/features/validation/auth.slice"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/routes/route.constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await dispatch(
        signupThunk({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      ).unwrap()
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Sign up failed",
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-3xl border border-muted/50 bg-background shadow-lg shadow-muted/10">
        <CardHeader className="px-10 pt-10 text-center">
          <CardTitle className="text-2xl font-semibold">
            Create your account
          </CardTitle>
          <CardDescription>
            Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-10 pt-4 pb-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    {...register("name")}
                  />
                </div>
                {errors.name ? (
                  <FieldDescription className="text-destructive">
                    {errors.name.message}
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email ? (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    {...register("password")}
                  />
                </div>
                {errors.password ? (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                ) : (
                  <FieldDescription className="text-muted-foreground">
                    8 or more characters
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-black/90"
                  disabled={isSubmitting}
                  data-testid="create-btn"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>Or continue with</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-3">
            <Button
              variant="outline"
              className="w-full justify-center gap-3"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-4"
              >
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center gap-3"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-4"
              >
                <rect x="3" y="3" width="8" height="8" fill="#f35325" />
                <rect x="13" y="3" width="8" height="8" fill="#81bc06" />
                <rect x="3" y="13" width="8" height="8" fill="#05a6f0" />
                <rect x="13" y="13" width="8" height="8" fill="#ffba08" />
              </svg>
              Microsoft
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-muted-foreground">
        By signing up, you agree to our <a href="#">Terms of Use</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
