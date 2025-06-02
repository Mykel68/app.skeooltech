import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface AnimatedInputLabelProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export function InputLabel({
  id,
  label,
  placeholder = " ",
  type = "text",
  register,
  error,
}: AnimatedInputLabelProps) {
  return (
    <div className="group relative flex flex-col">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="peer h-10 w-full border border-gray-300 rounded px-3 pt-4 pb-1 outline-none focus:border-green-500"
        {...register}
      />
      <Label
        htmlFor={id}
        className={`
          absolute left-3 top-1/2 -translate-y-1/2 px-1 text-sm text-gray-500 transition-all
          peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-green-600
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
        `}
      >
        {label}
      </Label>
      {error && <p className="mt-1 text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
