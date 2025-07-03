// src/components/Alert/SettingsAlert.tsx
"use client"

import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useState } from "react";

interface IAlertProps {
  title: string;
  message: string;
  type: "success" | "error";
  onClose?: () => void;
}

export function SettingsAlert({ title, message, type, onClose }: IAlertProps) {

  return (
     <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <Alert variant={type === "success" ? "default" : "destructive"}>
        {type === "success" ? <CheckCircle2Icon /> : <AlertCircleIcon />}
        
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
        </AlertDescription>

        {/* Botão OK */}
        {onClose && (
          <div className="mt-4">
            <button
              onClick={onClose}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${type === "success" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
                }
              `}
            >
              OK, entendi
            </button>
          </div>
        )}
      </Alert>
    </div>
  )
}