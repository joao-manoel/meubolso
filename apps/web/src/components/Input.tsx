import React, { InputHTMLAttributes, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { Input as I } from './ui/input'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id?: string // Opcional para permitir passagem do id manualmente
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  const [value, setValue] = useState<string>(props.value?.toString() || '')
  const [isFocused, setIsFocused] = useState(false)

  const inputId =
    id || `floating-input-${Math.random().toString(36).substring(2, 9)}`

  useEffect(() => {
    if (props.value) {
      setValue(props.value.toString())
      setIsFocused(true)
    }
  }, [props.value])

  const handleFocus = () => setIsFocused(true)

  const handleBlur = () => {
    if (typeof value === 'string' && value.trim() === '') {
      setIsFocused(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className="relative">
      <I
        id={inputId}
        className={cn(
          'block w-full rounded-md px-4 py-2 pb-2 pt-2 placeholder-transparent shadow-sm focus:outline-none',
          'peer',
          className,
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          'bg-transaprent absolute left-4 top-2 origin-[0] transform cursor-text px-1 text-gray-400 transition-all duration-200 ease-in-out',
          !isFocused && value === '' && 'top-1/2 -translate-y-1/2 scale-100', // Posição inicial
          (isFocused || value) && 'top-2 -translate-y-3 scale-[.70]', // Posição ao focar ou com valor
        )}
      >
        {label}
      </label>
    </div>
  )
}

export default Input
