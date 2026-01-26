import { toast } from "sonner";

export const showToast = {
  loading: (message: string) => {
    return toast.loading(message);
  },
  success: (message: string, id?: string | number) => {
    return toast.success(message, { id });
  },
  error: (message: string, id?: string | number) => {
    return toast.error(message, { id });
  },
};