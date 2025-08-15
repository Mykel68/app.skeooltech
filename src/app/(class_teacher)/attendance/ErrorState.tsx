import { AlertCircle } from "lucide-react";

export const ErrorState = ({ errorMessage }: { errorMessage?: string }) => (
  <div className="min-h-screen p-1 md:px-10 ">
    <div className=" mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Attendance
        </h2>
        <p className="text-gray-600 mb-4">
          Unable to load attendance information. Please try again.
        </p>
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded border">
          {errorMessage || "An unexpected error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
);
