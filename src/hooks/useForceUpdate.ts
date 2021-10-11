import { useState } from "react";

function useForceUpdate() {
  const [state, setState] = useState(0);
  return () => {
    console.log("force rerendered callded");
    setState(state + 1);
  };
}

export default useForceUpdate;
