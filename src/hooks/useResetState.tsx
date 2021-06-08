import React from "react";

type State = Record<string, unknown> | boolean | number | string;

function useResetState<T = State>(
  initialState: T,
  resetTime: number
): [T, (nextState: T) => void] {
  const [state, setState] = React.useState(initialState);

  React.useEffect(() => {
    let ignore = false;

    const timer = setTimeout(() => {
      if (!ignore) {
        setState(initialState);
      }
    }, resetTime);

    return () => {
      clearTimeout(timer);
      ignore = true;
    };
  }, [initialState, resetTime, state]);

  return [state, setState];
}

export default useResetState;
