import { useState, useRef, useEffect, Ref, useCallback } from "react";
import {
  IconCalendar,
  IconAngleDown,
  DateInput,
  TimeInput,
  Button,
  IconCheck,
  IconCross,
} from "hds-react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

import useIntermediaryState from "../../hooks/useIntermediaryState";
import { Locale } from "../../../config";
import getIsDateValid from "../../utils/getIsValidDate";
import { formatIntoDateTime } from "../../utils/time/format";
import styles from "./dateTimePicker.module.scss";

function getDate(value?: Date): string {
  if (!value) {
    return null;
  }

  return format(value, "d.M.y");
}

function getTime(value?: Date): string {
  if (!value) {
    return null;
  }

  return format(value, "H.m");
}

function getDateFromDateAndTimeString(
  dateString?: string,
  timeString?: string
): Date | undefined {
  if (!dateString || !timeString) {
    return;
  }

  const [D, M, Y] = dateString.split(".");
  const [H, m] = timeString.split(":");
  const hasAllDateParts = [D, M, Y, H, m].reduce(
    (acc, part) => acc && Boolean(part),
    true
  );

  if (!hasAllDateParts) {
    return;
  }

  return new Date(Number(Y), Number(M) - 1, Number(D), Number(H), Number(m));
}

function useOnOutsideClick<T extends HTMLElement>(
  callback: () => void
): Ref<T | null> {
  const ref = useRef<null | T>(null);

  useEffect(() => {
    const listener = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);

  return ref;
}

type Props = {
  id: string;
  name: string;
  onChange?: (value: Date) => void;
  value?: Date;
  label: string;
  locale?: Locale;
  minDate?: Date;
  maxDate?: Date;
};

export default function DateTimePicker({
  id,
  name,
  label,
  onChange,
  value = null,
  locale = "fi",
  minDate,
  maxDate,
}: Props) {
  const dateString = getDate(value);
  const timeString = getTime(value);

  const { t } = useTranslation("date_time_picker");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [intermediaryDate, setIntermediaryDate] = useIntermediaryState<
    string | null
  >(dateString);
  const [intermediaryTime, setIntermediaryTime] = useIntermediaryState<
    string | null
  >(timeString);
  const [date, setDate] = useState<Date | null>(value);
  const buttonRef = useRef(null);
  const containerRef = useOnOutsideClick<HTMLDivElement>(
    useCallback(() => setIsOpen(false), [])
  );

  const handleToggleMenu = () => {
    setIsOpen((previousValue) => !previousValue);
  };

  const handleCloseMenuButtonClick = () => {
    setIsOpen(false);
  };

  const handleDateChange = (nextDate: string) => {
    setIntermediaryDate(nextDate);
    onDatePartChange(nextDate, intermediaryTime);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = event.target.value;

    setIntermediaryTime(nextTime);
    onDatePartChange(intermediaryDate, nextTime);
  };

  const onDatePartChange = (date: string, time: string) => {
    const dateObject = getDateFromDateAndTimeString(date, time);
    const isValidDate = dateObject ? getIsDateValid(dateObject) : false;

    if (isValidDate) {
      setDate(dateObject);
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Escape":
        return setIsOpen(false);
    }
  };

  const handleSelectDateClick = () => {
    onChange(date);

    if (buttonRef.current) {
      buttonRef.current.focus();
    }

    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleOnKeyDown}
      className={classNames(styles.dropdown, {
        [styles.open]: isOpen,
      })}
    >
      <button
        type="button"
        onClick={handleToggleMenu}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={value ? `${label} ${formatIntoDateTime(value)}` : label}
        className={styles.dropdownButton}
        ref={buttonRef}
      >
        <IconCalendar
          aria-hidden="true"
          className={styles.dropdownButtonIcon}
        />
        <span className={styles.dropdownButtonTextContent}>
          {value ? formatIntoDateTime(value) : label}
        </span>
        <IconAngleDown
          aria-hidden="true"
          className={styles.dropdownButtonIcon}
        />
      </button>
      {isOpen && (
        <div
          className={classNames(styles.dropdownContent, {
            [styles.open]: isOpen,
          })}
        >
          <DateInput
            id={id + "-date-input"}
            name={name + "-date-input"}
            label={t("date_input.label")}
            onChange={handleDateChange}
            value={intermediaryDate || ""}
            helperText={t("date_input.helper_text")}
            language={locale as "en" | "fi" | "sv"}
            minDate={minDate}
            maxDate={maxDate}
          />
          <TimeInput
            id={id + "-time-input"}
            name={name + "-time-input"}
            label={t("time_input.label")}
            onChange={handleTimeChange}
            value={intermediaryTime || ""}
            hoursLabel={t("time_input.hours_label")}
            minutesLabel={t("time_input.minutes_label")}
          />
          <div className={styles.buttonRow}>
            <Button
              iconLeft={<IconCheck />}
              variant="secondary"
              onClick={handleSelectDateClick}
              size="small"
              disabled={!(date && getIsDateValid(date))}
            >
              {t("select")}
            </Button>
            <Button
              iconLeft={<IconCross />}
              variant="supplementary"
              onClick={handleCloseMenuButtonClick}
              size="small"
            >
              {t("close")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
