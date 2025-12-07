import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      <input 
        type="checkbox" 
        onChange={toggleTheme}
        checked={theme === 'dark'}
      />
      <Sun className="swap-off w-5 h-5 fill-current" />
      <Moon className="swap-on w-5 h-5 fill-current" />
    </label>
  )
}
