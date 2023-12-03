import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { bookings } from "./../../data/data-bookings";
import { PAGE_SIZE } from "../../utils/constants";

// export function useBookings() {
//   const [searchParams] = useSearchParams();
//   const queryClient = useQueryClient();
//   //FILTER
//   const filterValue = searchParams.get("status");

//   const filter =
//     !filterValue || filterValue === "all"
//       ? null
//       : { field: "status", value: filterValue, method: "eq" };
//   //SORTING
//   const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
//   const [field, direction] = sortByRaw.split("-");
//   const sortBy = { field, direction };

//   //PAGINATION
//   const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

//   //QUERY
//   const {
//     data: { bookings, count } = {},
//     error,
//     isLoading,
//   } = useQuery({
//     queryKey: ["bookings", filter, sortByRaw, page],
//     queryFn: () => getAllBookings({ filter, sortBy, page }),
//   });

//   console.log(bookings);
//   //PRE-FETCHING
//   const pageCount = Math.ceil(count / PAGE_SIZE);
//   if (page < pageCount)
//     queryClient.prefetchQuery({
//       queryKey: ["bookings", filter, sortByRaw, page + 1],
//       queryFn: () => getAllBookings({ filter, sortBy, page: page + 1 }),
//     });
//   if (page > 1)
//     queryClient.prefetchQuery({
//       queryKey: ["bookings", filter, sortByRaw, page - 1],
//       queryFn: () => getAllBookings({ filter, sortBy, page: page - 1 }),
//     });
//   return { isLoading, bookings, count, error };
// }
export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  // { field: "totalPrice", value: 5000, method: "gte" };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // QUERY
  const {
    isLoading,
    data: { bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getAllBookings({ filter, sortBy, page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getAllBookings({ filter, sortBy, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getAllBookings({ filter, sortBy, page: page - 1 }),
    });

  return { isLoading, error, bookings, count };
}
