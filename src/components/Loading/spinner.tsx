"use client"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  }

  const borderClasses = {
    sm: "border-2",
    md: "border-3",
    lg: "border-4",
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Círculo externo */}
        <div className={`${sizeClasses[size]} ${borderClasses[size]} border-sky-400/20 rounded-full`}></div>

        {/* Círculo animado */}
        <div
          className={`absolute top-0 left-0 ${sizeClasses[size]} ${borderClasses[size]} border-transparent border-t-sky-400 rounded-full animate-spin`}
        ></div>
      </div>

      {text && <p className="text-sky-200 text-sm animate-pulse">{text}</p>}
    </div>
  )
}