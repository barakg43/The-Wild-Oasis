import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBookingData } from "../bookings/UseBookingData";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import Checkbox from "./../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { updateBooking } from "../../services/apiBookings";
import { useCheckin } from "./useCheckin";
import { useSettings } from "./../settings/useSettings";
import { is } from "date-fns/locale";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [isAddBreakfast, setIsAddBreakfast] = useState(false);
  const moveBack = useMoveBack();
  const { booking, isLoading } = useBookingData();
  const { settings, isLoading: isLoadingSetting } = useSettings();
  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking?.isPaid]);
  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking ?? {};
  const { checkin, isCheckIn } = useCheckin(bookingId);
  if (isLoading || isLoadingSetting) return <Spinner />;

  const optionalBreakfastPrice =
    settings.breakfastPrice * numGuests * numNights;

  function handleCheckin() {
    if (confirmPaid) {
      if (isAddBreakfast) {
        checkin({
          bookingId,
          breakfast: {
            hasBreakfast: true,
            extrasPrice: optionalBreakfastPrice,
            totalPrice: totalPrice + optionalBreakfastPrice,
          },
        });
      } else {
        checkin({
          bookingId,
          breakfast: {},
        });
      }
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={isAddBreakfast}
            onChange={() => {
              setIsAddBreakfast((isAdd) => !isAdd);
              setConfirmPaid(false);
            }}
            id="breakfast"
            disabled={hasBreakfast}
          >
            Want to add breakfast for the price{" "}
            {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}
      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          id="confirm"
          disabled={confirmPaid || isCheckIn}
        >
          confirm that {guests.fullName} has paid the total amount of{" "}
          {isAddBreakfast
            ? `${formatCurrency(
                optionalBreakfastPrice + totalPrice
              )} (${formatCurrency(totalPrice)} +
              ${formatCurrency(optionalBreakfastPrice)})`
            : formatCurrency(totalPrice)}
        </Checkbox>
      </Box>
      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckIn}>
          Check in booking #{bookingId}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
