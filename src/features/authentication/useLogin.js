import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { redirect, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: loginApi,
    onSuccess: (user) => {
      if (user) {
        toast.success("login successfully!");
        queryClient.setQueryData(["user"], user.user);
        navigate("/dashboard", { replace: true });
      }
    },
    onError: (error) => {
      console.error(error.message);
      toast.error("Provided email or password are incorrect");
    },
  });
  return { login, isLoading };
}
