import React from "react"

interface DialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = ({ 
  open,
  onOpenChange,
  className = '',
  children
}) => {
  if (!open) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
        {children}
      </div>
    </div>
  )
}

interface DialogHeaderProps {
  className?: string
  children: React.ReactNode
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ className = '', children }) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
      {children}
    </div>
  )
}

interface DialogTitleProps {
  className?: string
  children: React.ReactNode
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ className = '', children }) => {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  )
}

interface DialogDescriptionProps {
  className?: string
  children: React.ReactNode
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ className = '', children }) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  )
}

interface DialogContentProps {
  className?: string
  children: React.ReactNode
}

export const DialogContent: React.FC<DialogContentProps> = ({ className = '', children }) => {
  return (
    <div className={`pt-4 ${className}`}>
      {children}
    </div>
  )
}
