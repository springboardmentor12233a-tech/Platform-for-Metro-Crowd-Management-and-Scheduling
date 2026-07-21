import { useContext } from "react";
import MetroContext from "../context/MetroContext";

function useMetro() {
  const context = useContext(MetroContext);

  if (!context) {
    throw new Error(
      "useMetro must be used within MetroProvider."
    );
  }

  return context;
}

export default useMetro;