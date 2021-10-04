import { useState, useEffect, Dispatch, SetStateAction } from "react";

type IntermediaryValue = string[] | string | number | number[] | boolean | Date;

export default function useIntermediaryState<S extends IntermediaryValue>(
  value: S
): [S, Dispatch<SetStateAction<S>>] {
  const [intermediaryValue, setIntermediaryValue] = useState<S>(value);

  useEffect(() => {
    setIntermediaryValue(value);
  }, [value]);

  return [intermediaryValue, setIntermediaryValue];
}
