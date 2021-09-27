import classNames from "classnames";
import { DateInput as HDSDateInput, DateInputProps } from "hds-react";

import styles from "./dateInput.module.scss";

function DateInput({ className, ...delegated }: DateInputProps) {
  return (
    <HDSDateInput
      {...delegated}
      className={classNames(className, styles.dateInput)}
    />
  );
}

export default DateInput;
