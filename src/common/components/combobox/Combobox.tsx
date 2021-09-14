import classNames from "classnames";
import { Combobox as HDSCombobox, ComboboxProps } from "hds-react";

import { Option } from "../../../types";
import styles from "./combobox.module.scss";

export default function Combobox({
  className,
  ...delegated
}: ComboboxProps<Option>) {
  return (
    <HDSCombobox
      {...delegated}
      className={classNames(styles.select, className)}
    />
  );
}
