"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";


const HourContext = createContext<any>(null);


export function HourProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [selectedHour, setSelectedHour] = useState("00");


  return (
    <HourContext.Provider
      value={{
        selectedHour,
        setSelectedHour,
      }}
    >
      {children}
    </HourContext.Provider>
  );

}


export function useHour() {

  return useContext(HourContext);

}