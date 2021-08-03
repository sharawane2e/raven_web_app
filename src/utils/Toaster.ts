import { toast, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type ToastTypes = "success" | "error" | "warn" | "info";

class Toaster {
  static success = function (
    message: string,
    position: ToastPosition = toast.POSITION.TOP_RIGHT
  ) {
    toast.success(message, {
      position,
      autoClose: 3000,
      closeButton: false,
    });
  };

  static error = function (
    message: string,
    position: ToastPosition = toast.POSITION.TOP_RIGHT
  ) {
    toast.error(message, {
      position,
      autoClose: 3000,
      closeButton: false,
    });
  };

  static warn = function (
    message: string,
    position: ToastPosition = toast.POSITION.TOP_RIGHT
  ) {
    toast.warn(message, {
      position,
      autoClose: 3000,
      closeButton: false,
    });
  };

  static info = function (
    message: string,
    position: ToastPosition = toast.POSITION.TOP_RIGHT
  ) {
    toast.info(message, {
      position,
      autoClose: 3000,
      closeButton: false,
    });
  };
}

export default Toaster;
