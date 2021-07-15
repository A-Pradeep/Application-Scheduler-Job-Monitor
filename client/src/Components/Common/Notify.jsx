import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notifySuccess = (title, position = "top-right") =>
  toast.success(title, {
    position: position,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const notifyDanger = (title, position = "top-right") =>
  toast.warn(title, {
    position: position,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const notifyError = (title, position = "top-right") =>
  toast.error(title, {
    position: position,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const Notify = {
  success: notifySuccess,
  warning: notifyDanger,
  error: notifyError,
};

export default Notify;
