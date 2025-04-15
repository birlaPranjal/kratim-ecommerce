"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: {
    id?: string
    name?: string
    email?: string
    image?: string
    role?: string
  } | null
  status: "loading" | "authenticated" | "unauthenticated"
  signIn: (provider?: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  signIn: async () => {},
  signOut: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={useAuthValue()}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuthValue(): AuthContextType {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignIn = async (provider = "google") => {
    await signIn(provider)
  }

  const handleSignOut = () => {
    router.push("/auth/signout")
  }

  return {
    user: session?.user || null,
    status: status,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }
}

export const useAuth = () => useContext(AuthContext) 