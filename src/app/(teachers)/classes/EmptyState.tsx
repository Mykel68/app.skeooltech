import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const SubjectEmptyState: React.FC<EmptyStateProps> = ({
  onCreateClick,
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="relative mb-6">
      {/* Decorative background circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-blue-50 dark:bg-blue-950/30 rounded-full animate-pulse" />
      </div>
      <div className="relative z-10 w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 rounded-full">
        <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
    </div>

    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      No subjects yet
    </h3>

    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
      Get started by creating your first subject. You can organize your
      curriculum and manage classes more effectively.
    </p>

    <div className="flex flex-col sm:flex-row gap-3">
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="w-4 h-4" />
        Create First Subject
      </Button>

      <Button variant="outline" className="gap-2">
        <BookOpen className="w-4 h-4" />
        Learn More
      </Button>
    </div>

    {/* Optional: Quick tips */}
    <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg max-w-md">
      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">
        💡 Quick tip
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Start by creating subjects for your most important classes. You can
        always add more later.
      </p>
    </div>
  </div>
);
