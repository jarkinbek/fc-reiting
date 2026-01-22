import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", className, ...props }, ref) => (
    <input
      type={type} // ✅ задаём тип по умолчанию
      className={cn(
        "flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
