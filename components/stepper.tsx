import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border",
                currentStep > index + 1
                  ? "bg-green-500 text-white border-green-500 dark:bg-green-600 dark:border-green-600"
                  : currentStep === index + 1
                  ? "bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:border-blue-600"
                  : "bg-white text-gray-400 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
              )}
            >
              {currentStep > index + 1 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-1",
                currentStep >= index + 1
                  ? "text-gray-700 dark:text-gray-200"
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1 flex-1",
              index === steps.length - 1
                ? "hidden"
                : currentStep > index + 1
                ? "bg-green-500 dark:bg-green-600"
                : "bg-gray-200 dark:bg-gray-700"
            )}
          />
        ))}
      </div>
    </div>
  );
}
