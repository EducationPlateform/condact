import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  securityService,
  SecurityViolation,
} from "../services/securityService";

interface VideoSecurityState {
  isSecureMode: boolean;
  violations: SecurityViolation[];
  reportViolation: (type: string, details: any) => Promise<void>;
  getViolations: (params?: {
    studentId?: string;
    lectureId?: string;
    videoId?: string;
  }) => Promise<void>;
}

const VideoSecurityContext = createContext<VideoSecurityState | undefined>(
  undefined,
);

export const VideoSecurityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSecureMode] = useState(true);
  // const [isSecureMode, setIsSecureMode] = useState(true);
  const [violations, setViolations] = useState<SecurityViolation[]>([]);

  // const reportViolation = useCallback(async (lectureId: string, videoId: string | null, type: string, details: any) => {
  //   try {
  //     await securityService.reportViolation(lectureId, videoId, type, details);
  //     // Optionally refresh violations list
  //   } catch (error) {
  //     console.error('Failed to report violation:', error);
  //     throw error;
  //   }
  // }, []);

  const getViolations = useCallback(
    async (params?: {
      studentId?: string;
      lectureId?: string;
      videoId?: string;
    }) => {
      try {
        const violationsList = await securityService.getViolations(params);
        setViolations(violationsList);
      } catch (error) {
        console.error("Failed to get violations:", error);
      }
    },
    [],
  );

  const value: VideoSecurityState = {
    isSecureMode,
    violations,
    reportViolation: async (_type: string, _details: any) => {
      // This will be called with lectureId and videoId from the component
      // For now, we'll create a wrapper that components can use
      throw new Error(
        "reportViolation must be called with lectureId and videoId",
      );
    },
    getViolations,
  };

  return (
    <VideoSecurityContext.Provider value={value}>
      {children}
    </VideoSecurityContext.Provider>
  );
};

export const useVideoSecurity = () => {
  const context = useContext(VideoSecurityContext);
  if (context === undefined) {
    throw new Error(
      "useVideoSecurity must be used within a VideoSecurityProvider",
    );
  }
  return context;
};
