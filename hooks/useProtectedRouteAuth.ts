import { useRouter } from "next/router"
import { useAuth } from "../services/auth"

export const useProtectedRouteAuth = (redirectRoute = "/auth") => {
  const user = useAuth()
  const { currentUser, isLoading } = user
  const router = useRouter()

  if (!currentUser && !isLoading) {
    router.push(redirectRoute)
  }

  return user
}
