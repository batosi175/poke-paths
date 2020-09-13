import { useRef } from "react";

export const useCountRenders = (componentName: string) => {
  const renders = useRef(0);
  console.log(componentName + " renders: ", renders.current++);
};
