import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
export function useCheckout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully check out`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: () => toast.error("there are an error while check out"),
  });
  return { checkout, isCheckingOut };
}
