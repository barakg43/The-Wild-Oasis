import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "../../services/apiBookings";

export function useBookings() {
  const {
    data: bookings,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getAllBookings,
  });
  return { isLoading, bookings, error };
}
