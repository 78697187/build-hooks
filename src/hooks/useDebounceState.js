/* 对state的修改做防抖操作 */
import { useState, useEffect } from "react";

function useDebounceState(value, delay = 300) {
  const [ debouncedValue, setDebouncedValue ] = useState(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);


    return () => {
      clearTimeout(handler);
    }
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounceState;