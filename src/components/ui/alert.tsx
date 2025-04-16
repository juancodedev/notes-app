import React from "react"

interface AlertProps {
  title: string
  description: string
  className?: string
  children?: React.ReactNode
}

export const Alert: React.FC<AlertProps> = ({ title, description, className, children }) => {
  return (
    <div className={`alert ${className}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  )
}

export const AlertTitle: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <h3 className="alert-title">{children}</h3>
)

export const AlertDescription: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <p className="alert-description">{children}</p>
)
