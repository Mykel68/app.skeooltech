"use client";
import { Input } from "@/components/ui/input";
import { FieldError } from "react-hook-form";

interface ScoreInputProps {
  name: string;
  error?: FieldError;
  register: any;
  max: number;
  value?: number;
}

export const ScoreInput = ({
  name,
  error,
  register,
  max,
  value,
}: ScoreInputProps) => (
  <div>
    <Input
      type="number"
      min={0}
      max={max}
      className={`appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
    [-moz-appearance:textfield] ${error ? "border-red-500" : ""}`}
      {...register(name, {
        valueAsNumber: true,
        min: { value: 0, message: "Cannot be less than 0" },
        max: { value: max, message: `Cannot exceed ${max}` },
      })}
      value={value}
    />

    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);
