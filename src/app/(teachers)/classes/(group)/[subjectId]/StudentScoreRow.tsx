"use client";

import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface GradingComponent {
  name: string;
  weight: number;
}

interface StudentScore {
  component_name: string;
  score: number;
}

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
  scores?: StudentScore[];
}

interface Props {
  student: Student;
  gradingComponents: GradingComponent[];
  register: any;
  errors: any;
  control: any;
  onClick?: (student: Student) => void;
}

// Custom Error Component
const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-1 mt-1">
      <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
      <span className="text-xs text-red-500 leading-tight">{message}</span>
    </div>
  );
};

// Custom Error Boundary Component
class ScoreInputErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("StudentScoreRow Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <TableCell className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Error loading score input</span>
            </div>
          </TableCell>
        )
      );
    }

    return this.props.children;
  }
}

const normalizeKey = (key: string) => key.toLowerCase().replace(/\s+/g, "_");

export const StudentScoreRow = ({
  student,
  gradingComponents,
  register,
  errors,
  control,
  onClick,
}: Props) => {
  // Add trigger function to force validation
  const { trigger } = useFormContext() || {};
  // Add error handling for useWatch
  let watchedValues;
  try {
    watchedValues = useWatch({
      control,
      name: `students.${student.user_id}`,
    });
  } catch (error) {
    console.error("useWatch error:", error);
    watchedValues = {};
  }

  // Add safety check for gradingComponents
  if (!gradingComponents || !Array.isArray(gradingComponents)) {
    return (
      <TableRow>
        <TableCell colSpan={100} className="text-center text-red-500">
          Error: Invalid grading components data
        </TableCell>
      </TableRow>
    );
  }

  // Add safety check for student data
  if (!student || !student.user_id) {
    return (
      <TableRow>
        <TableCell colSpan={100} className="text-center text-red-500">
          Error: Invalid student data
        </TableCell>
      </TableRow>
    );
  }

  const total = gradingComponents.reduce((sum, comp) => {
    try {
      const key = normalizeKey(comp.name);
      const val = watchedValues?.[key];
      const num = typeof val === "number" ? val : parseFloat(val) || 0;
      return sum + (num > comp.weight ? comp.weight : num);
    } catch (error) {
      console.error("Error calculating total for component:", comp.name, error);
      return sum;
    }
  }, 0);

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted"
      tabIndex={0}
      role="button"
      aria-pressed="false"
    >
      <TableCell onClick={() => onClick?.(student)}>
        {student.first_name || "N/A"}
      </TableCell>
      <TableCell onClick={() => onClick?.(student)}>
        {student.last_name || "N/A"}
      </TableCell>

      {gradingComponents.map((comp, index) => {
        const key = normalizeKey(comp.name);
        const fieldName = `students.${student.user_id}.${key}`;
        const error = errors?.students?.[student.user_id]?.[key];

        // Fix: Remove the incorrect maxLength logic
        // The issue in your original code is here - you're checking comp.weight to determine maxLength
        // but then using a fixed validation for 3 digits regardless of the actual weight
        const getMaxLength = (weight: number): number => {
          if (weight < 10) return 1;
          if (weight < 100) return 2;
          if (weight < 1000) return 3;
          return 4;
        };

        const maxLength = getMaxLength(comp.weight);

        return (
          <TableCell key={`${comp.name}-${index}`}>
            <ScoreInputErrorBoundary
              fallback={
                <div className="text-xs text-red-500">Error loading input</div>
              }
            >
              <div className="flex flex-col">
                <Input
                  type="number"
                  min={0}
                  max={comp.weight}
                  className={error ? "border-red-500" : ""}
                  {...register(fieldName, {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Score must be at least 0",
                    },
                    max: {
                      value: comp.weight,
                      message: `Max score is ${comp.weight}`,
                    },
                    validate: (val: number | string) => {
                      const numVal =
                        typeof val === "string" ? parseFloat(val) : val;

                      if (isNaN(numVal)) {
                        return "Please enter a valid number";
                      }

                      if (numVal < 0) {
                        return "Score cannot be negative";
                      }

                      if (numVal > comp.weight) {
                        return `Score must not exceed ${comp.weight}`;
                      }

                      return true;
                    },
                  })}
                />

                {/* <Input
                  type="number"
                  min={0}
                  max={comp.weight}
                  className={error ? "border-red-500" : ""}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    // Remove any non-digit characters and limit length
                    let value = target.value.replace(/[^0-9.]/g, "");

                    // Handle decimal points (only allow one)
                    const parts = value.split(".");
                    if (parts.length > 2) {
                      value = parts[0] + "." + parts.slice(1).join("");
                    }

                    // Enforce maxLength
                    if (value.length > maxLength) {
                      value = value.slice(0, maxLength);
                    }

                    // Update the input value
                    target.value = value;
                  }}
                  onChange={async (e) => {
                    // Trigger validation immediately when value changes
                    const value = parseFloat(e.target.value) || 0;

                    // Call the register's onChange first
                    const registerResult = register(fieldName, {
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Score must be at least 0",
                      },
                      max: {
                        value: comp.weight,
                        message: `Max score is ${comp.weight}`,
                      },
                      validate: (val: number | string) => {
                        const numVal =
                          typeof val === "string" ? parseFloat(val) : val;

                        if (isNaN(numVal)) {
                          return "Please enter a valid number";
                        }

                        if (numVal < 0) {
                          return "Score cannot be negative";
                        }

                        if (numVal > comp.weight) {
                          return `Score must not exceed ${comp.weight}`;
                        }

                        return true;
                      },
                    });

                    if (registerResult.onChange) {
                      await registerResult.onChange(e);
                    }

                    // Force validation to run immediately
                    if (trigger) {
                      setTimeout(() => trigger(fieldName), 0);
                    }
                  }}
                  onKeyDown={(e) => {
                    // Prevent typing if already at maxLength
                    const target = e.target as HTMLInputElement;
                    if (
                      target.value.length >= maxLength &&
                      ![
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  {...register(fieldName, {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Score must be at least 0",
                    },
                    max: {
                      value: comp.weight,
                      message: `Max score is ${comp.weight}`,
                    },
                    validate: (val: number | string) => {
                      // Handle both number and string inputs
                      const numVal =
                        typeof val === "string" ? parseFloat(val) : val;

                      if (isNaN(numVal)) {
                        return "Please enter a valid number";
                      }

                      if (numVal < 0) {
                        return "Score cannot be negative";
                      }

                      if (numVal > comp.weight) {
                        return `Score must not exceed ${comp.weight}`;
                      }

                      return true;
                    },
                  })}
                /> */}
                <FieldError message={error?.message} />
              </div>
            </ScoreInputErrorBoundary>
          </TableCell>
        );
      })}

      <TableCell className="font-semibold">
        {isNaN(total) ? "Error" : total.toFixed(1)}
      </TableCell>
    </TableRow>
  );
};

// Export the error boundary for use elsewhere if needed
export { ScoreInputErrorBoundary, FieldError };
