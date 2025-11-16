// utils/themeSignal.ts
import { signal, effect } from 'omi'
// Hàm phát hiện theme hiện tại từ nhiều nguồn universal
function detectCurrentTheme(): string {
  // 0. Kiểm tra localStorage key trước tiên (Độ ưu tiên cao nhất)
  const localTheme = localStorage.getItem('vbot-console-active-theme-name-key')?.trim()
  if (localTheme === 'dark' || localTheme === 'normal' || localTheme === 'system') {
    console.log('Theme detected from localStorage:', localTheme)
    return localTheme
  }

  // 1. Kiểm tra CSS custom property trên :root
  const rootStyle = getComputedStyle(document.documentElement)
  const primaryColor = rootStyle.getPropertyValue('--primary').trim()
  const bgColor = rootStyle.getPropertyValue('--vb-bg').trim() || rootStyle.getPropertyValue('background-color').trim()

  // Dark theme indicators
  if (primaryColor === '#3e87e0' || bgColor === '#141414' || bgColor === 'rgb(38, 38, 38)' || bgColor === '#2c3e50') {
    return 'dark'
  }

  // 2. Kiểm tra class trên document.documentElement
  const htmlElement = document.documentElement
  if (
    htmlElement.classList.contains('dark') ||
    htmlElement.classList.contains('dark-theme') ||
    htmlElement.classList.contains('theme-dark')
  ) {
    return 'dark'
  }

  // 3. Kiểm tra data-theme attribute
  const dataTheme = htmlElement.getAttribute('data-theme')
  if (dataTheme === 'dark') return 'dark'
  if (dataTheme === 'system') return 'system'

  // 4. Kiểm tra body class (một số framework dùng body)
  if (document.body?.classList.contains('dark') || document.body?.classList.contains('dark-theme')) {
    return 'dark'
  }

  // 5. Kiểm tra prefers-color-scheme nếu không tìm thấy
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'system'
  }

  // 6. Fallback to light
  return 'normal'
}

// Global theme signal
export const themeSignal = signal(detectCurrentTheme())

/**
 * Lấy theme hiệu lực hiện tại, giải quyết 'system' thành 'dark' hoặc 'normal'.
 * @returns {'dark' | 'normal'} - Theme hiệu lực.
 */
export function getResolvedTheme(): 'dark' | 'normal' {
  const currentTheme = themeSignal.value

  if (currentTheme === 'dark') {
    return 'dark'
  }

  if (currentTheme === 'system') {
    // Kiểm tra cài đặt của hệ điều hành/trình duyệt nếu chế độ là 'system'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'normal'
  }

  // Mặc định là 'normal' cho các trường hợp còn lại
  return 'normal'
}

// Helper function để components dễ sử dụng
export function useTheme(component: any) {
  let disposed = false

  // Effect sẽ chạy mỗi khi themeSignal thay đổi
  const dispose = effect(() => {
    if (disposed) return

    const theme = themeSignal.value
    const hostElement = component as unknown as HTMLElement

    // Update host class
    hostElement.classList.remove('normal', 'dark')
    if (theme === 'dark') {
      hostElement.classList.add('dark')
    } else if (theme === 'system') {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemIsDark) {
        hostElement.classList.add('dark')
      }
    }

    // Trigger re-render
    try {
      component.update()
      console.log(`${component.constructor.name} updated theme:`, theme)
    } catch (error) {
      console.warn(`Failed to update component ${component.constructor.name}:`, error)
    }
  })

  return () => {
    disposed = true
    dispose()
  }
}

// Listen to window events và sync với signal
// Listen to window events và sync với signal
window.addEventListener('theme-change', (e: Event) => {
  const customEvent = e as CustomEvent
  const newTheme = customEvent.detail?.theme
  if (newTheme === 'dark' || newTheme === 'normal' || newTheme === 'system') {
    themeSignal.value = newTheme
  } else {
    console.warn(`Invalid theme value received: ${newTheme}`)
  }
})

// Để debug dễ hơn
if (typeof window !== 'undefined') {
  ;(window as any).themeSignal = themeSignal
}
