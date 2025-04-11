"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { cn } from "@/lib/utils"

// Forward ref for InputOTP component
export const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props} />
))
InputOTP.displayName = "InputOTP"

// Forward ref for InputOTPGroup component
export const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

// Forward ref for InputOTPSlot component
export const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-14 w-14 items-center justify-center border-2 border-gray-500 rounded-lg text-3xl text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none",
        isActive && "z-10 ring-2 ring-blue-500",
        className
      )}
      {...props}>
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-blue-500 duration-1000" />
        </div>
      )}
    </div>
  );
})
InputOTPSlot.displayName = "InputOTPSlot"

// Forward ref for InputOTPSeparator component
export const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    {/* Separator Icon (Optional) */}
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"
