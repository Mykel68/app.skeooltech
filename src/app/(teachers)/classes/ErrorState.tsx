import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export const SubjectErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 dark:bg-red-900/50 rounded-full">
      <BookOpen className="w-8 h-8 text-red-600 dark:text-red-400" />
    </div>

    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      Unable to load subjects
    </h3>

    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
      We encountered an error while loading your subjects. Please try again.
    </p>

    <Button onClick={onRetry} variant="outline">
      Try Again
    </Button>
  </div>
);
