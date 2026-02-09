import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { studentStrings } from "@/studentStrings";

interface NavigationButtonsProps {
    onNext: () => void;
    onPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
}

const NavigationButtons = ({ onNext, onPrevious, hasNext, hasPrevious }: NavigationButtonsProps) => {
    return (
        <div className="mt-6 flex flex-row-reverse items-center justify-between gap-4">
            <Button
                onClick={onNext}
                disabled={!hasNext}
                className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {studentStrings.next}
                <ArrowRight className="h-4 w-4 ml-2 rotate-180" />
            </Button>
            <Button
                onClick={onPrevious}
                disabled={!hasPrevious}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                {studentStrings.previous}
            </Button>
        </div>
    );
};

export default NavigationButtons;
