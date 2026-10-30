import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'

export type BackFallback = '/' | '/history' | '/exercises'

/** Revient à la page précédente, ou à `fallback` si l'app a été ouverte directement sur cette page. */
export function useGoBack(fallback: BackFallback) {
  const router = useRouter()
  const navigate = useNavigate()
  const canGoBack = useCanGoBack()
  return () => (canGoBack ? router.history.back() : navigate({ to: fallback }))
}
