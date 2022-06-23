import { FocusEventHandler, KeyboardEventHandler, ReactNode } from 'react'

export type DecoratedInputProps = {
  autocomplete?: boolean
  className?: string
  disabled?: boolean
  left?: ReactNode[]
  onBlur?: FocusEventHandler
  onChange?: (text: string) => void
  onFocus?: FocusEventHandler
  onKeyDown?: KeyboardEventHandler
  onKeyUp?: KeyboardEventHandler
  placeholder?: string
  right?: ReactNode[]
  title?: string
  type?: 'text' | 'email' | 'password'
  value?: string
}
