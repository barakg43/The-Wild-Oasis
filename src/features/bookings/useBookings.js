import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export function useBookings() {
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("status");
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue, method: "eq" };
  const {
    data: bookings,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bookings", filter, sortByRaw],
    queryFn: () => getAllBookings({ filter, sortBy }),
  });
  return { isLoading, bookings, error };
}
