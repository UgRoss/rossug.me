// ABOUTME: React + Radix UI theme toggle dropdown with Automatic, Light, and Dark options.
// ABOUTME: Uses the useTheme hook to read and set the active theme mode.

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, Moon, Sun } from 'lucide-react'

import type { ThemeMode } from '@/types/theme.types'

import { useTheme } from '@/hooks/use-theme'

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'Automatic', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const isThemeMode = (value: string): value is ThemeMode =>
  value === 'system' || value === 'light' || value === 'dark'

const ThemeToggle = () => {
  const { mode, setMode } = useTheme()

  const handleModeChange = (value: string) => {
    if (!isThemeMode(value)) return
    setMode(value)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Theme settings"
          className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-(--selection) hover:text-(--text-primary)"
          type="button"
        >
          <Sun aria-hidden="true" className="size-4.5 dark:hidden" />
          <Moon aria-hidden="true" className="hidden size-4.5 dark:block" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-32 rounded-lg border border-(--border) bg-(--bg) p-1 shadow-md select-none"
          sideOffset={6}
        >
          <DropdownMenu.RadioGroup onValueChange={handleModeChange} value={mode}>
            {THEME_OPTIONS.map(({ label, value }) => (
              <DropdownMenu.RadioItem
                className="font-inherit tracking-inherit flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-1.5 text-left text-(length:--font-size-m) font-medium text-muted transition-colors duration-150 outline-none hover:bg-(--selection) hover:text-(--text-primary) data-[state=checked]:text-(--text-primary)"
                key={value}
                value={value}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-3.5 shrink-0 items-center justify-center"
                >
                  <DropdownMenu.ItemIndicator asChild>
                    <Check className="size-3.5" />
                  </DropdownMenu.ItemIndicator>
                </span>
                <span>{label}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default ThemeToggle
