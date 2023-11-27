import styled from "styled-components";
import { getCabins } from "../../services/apiCabin";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

// const Table = styled.div`
//   border: 1px solid var(--color-grey-200);

//   font-size: 1.4rem;
//   background-color: var(--color-grey-0);
//   border-radius: 7px;
//   overflow: hidden;
// `;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;
function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();
  if (isLoading) return <Spinner />;
  if (!cabins || !cabins.length) return <Empty resource="cabins" />;

  const filterValue = searchParams.get("discount") || "all";
  const filterCabins = getFilteredCabins(cabins, filterValue);

  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const sortedCabins = getSortedCabins(filterCabins, sortBy);
  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header role="row">
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}
function getFilteredCabins(cabins, filterValue) {
  let filterCabins;
  if (filterValue === "all") filterCabins = cabins;
  else if (filterValue === "with-discount")
    filterCabins = cabins.filter((cabin) => cabin.discount > 0);
  else if (filterValue === "no-discount")
    filterCabins = cabins.filter((cabin) => cabin.discount === 0);

  return filterCabins;
}
function getSortedCabins(cabins, sortBy) {
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = cabins.sort((a, b) => (a[field] - b[field]) * modifier);
  return sortedCabins;
}

export default CabinTable;
