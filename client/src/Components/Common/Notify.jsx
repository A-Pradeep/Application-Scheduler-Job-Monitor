import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constant Notification parameters
const NotifyParams = (position = "top-right") => {
  return {
    position: position,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
};

const notifySuccess = (title, position) =>
  toast.success(title, NotifyParams(position));

const notifyDanger = (title, position) =>
  toast.warn(title, NotifyParams(position));

const notifyError = (title, position) =>
  toast.error(title, NotifyParams(position));

const Notify = {
  success: notifySuccess,
  warning: notifyDanger,
  error: notifyError,
};

export default Notify;
