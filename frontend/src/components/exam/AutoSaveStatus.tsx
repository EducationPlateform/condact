import { CheckCircle2 } from "lucide-react";
import { studentStrings } from "@/studentStrings";

interface AutoSaveStatusProps {
    visible: boolean;
}

const AutoSaveStatus = ({ visible }: AutoSaveStatusProps) => {
    if (!visible) return null;

    return (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>{studentStrings.savedAutomatically}</span>
        </div>
    );
};

export default AutoSaveStatus;
