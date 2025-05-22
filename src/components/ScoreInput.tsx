"use client";
import { Input } from "@/components/ui/input";
import { FieldError } from "react-hook-form";

interface ScoreInputProps {
  name: string;
  error?: FieldError;
  register: any;
  max: number;
}

export const ScoreInput = ({ name, error, register, max }: ScoreInputProps) => (
  <div>
    <Input
      type="number"
      min={0}
      max={max}
      className={error ? "border-red-500" : ""}
      {...register(name, {
        valueAsNumber: true,
        min: { value: 0, message: "Cannot be less than 0" },
        max: { value: max, message: `Cannot exceed ${max}` },
      })}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);
