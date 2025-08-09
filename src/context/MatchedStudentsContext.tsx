'use client'
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Match } from "@/components/matchStudents";

interface MatchedStudentsContextType {
  matchedStudents: Match[];
  setMatchedStudents: React.Dispatch<React.SetStateAction<Match[]>>;
}

const MatchedStudentsContext = createContext<MatchedStudentsContextType | undefined>(undefined);

export const MatchedStudentsProvider = ({ children }: { children: ReactNode }) => {
  const [matchedStudents, setMatchedStudents] = useState<Match[]>([]);

  return (
    <MatchedStudentsContext.Provider value={{ matchedStudents, setMatchedStudents }}>
      {children}
    </MatchedStudentsContext.Provider>
  );
};

export const useMatchedStudents = () => {
  const context = useContext(MatchedStudentsContext);
  if (!context) throw new Error("useMatchedStudents must be used within MatchedStudentsProvider");
  return context;
};
