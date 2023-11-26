import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const elementToExclude = useRef();

  useEffect(
    function () {
      function handleClick(event) {
        if (
          elementToExclude.current &&
          !elementToExclude.current.contains(event.target)
        ) {
          handler();
        }
      }
      document.addEventListener("click", handleClick, listenCapturing);
      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return elementToExclude;
}
