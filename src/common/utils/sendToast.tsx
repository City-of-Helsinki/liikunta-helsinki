import { toast } from "react-toastify";
import { Notification, NotificationType, NotificationProps } from "hds-react";

export default function sendToast(
  title: string,
  message: string,
  type: NotificationType,
  options?: Omit<Partial<NotificationProps>, "size">
) {
  toast(({ closeToast }) => (
    <Notification
      label={title}
      position="top-right"
      dismissible
      closeButtonLabelText="Close toast"
      type={type}
      onClose={closeToast}
      {...options}
    >
      {message}
    </Notification>
  ));
}
