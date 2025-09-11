import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persist, createJSONStorage } from 'zustand/middleware'
import { api } from '../services/api'

interface User {
  id: string
  email: string
  role: string
  onboardingCompleted: boolean
  currentOnboardingStep?: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, confirmPassword: string, termsAccepted: boolean, hipaaNoticeAcknowledged: boolean) => Promise<boolean>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  checkAuthStatus: () => Promise<void>
  refreshUserProfile: () => Promise<void>
  clearAllData: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true for initial auth check
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await api.login({ email, password })
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          } else {
            set({
              isLoading: false,
              error: response.error || 'Login failed',
            })
            return false
          }
        } catch (error) {
          set({
            isLoading: false,
            error: 'Network error. Please try again.',
          })
          return false
        }
      },

      register: async (email: string, password: string, confirmPassword: string, termsAccepted: boolean, hipaaNoticeAcknowledged: boolean) => {
        set({ isLoading: true, error: null })
        
        if (password !== confirmPassword) {
          set({
            isLoading: false,
            error: 'Passwords do not match',
          })
          return false
        }

        try {
          const response = await api.register({ email, password, confirmPassword, termsAccepted, hipaaNoticeAcknowledged })
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          } else {
            set({
              isLoading: false,
              error: response.error || 'Registration failed',
            })
            return false
          }
        } catch (error) {
          set({
            isLoading: false,
            error: 'Network error. Please try again.',
          })
          return false
        }
      },

      logout: () => {
        api.logout()
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      checkAuthStatus: async () => {
        try {
          const isAuth = await api.isAuthenticated()
          if (isAuth) {
            // Get current user data
            const response = await api.getCurrentUser()
            if (response.success && response.data) {
              set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
              })
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              })
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      refreshUserProfile: async () => {
        try {
          const response = await api.getUserProfile()
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              error: null,
            })
          }
        } catch (error) {
          console.error('Failed to refresh user profile:', error)
        }
      },

      clearAllData: async () => {
        try {
          // Clear API data
          await api.clearAllAuthData()
          
          // Reset store state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
          
          console.log('✅ All authentication data and store cleared!')
        } catch (error) {
          console.error('Failed to clear all data:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
