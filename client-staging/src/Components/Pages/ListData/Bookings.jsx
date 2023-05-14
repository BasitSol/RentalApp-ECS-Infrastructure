import {
  Delete as DeleteIcon,
  RateReview as RateReviewIcon
} from "@mui/icons-material";
import {
  Button, Container, DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Rating, Typography
} from "@mui/material";
import moment from "moment";
import {
  Fragment, useContext, useEffect, useState
} from "react";
import { toast } from "react-hot-toast";
import { BOOKINGS_TABLE_HEADINGS, SKELETON_LOAD_TIME } from "../../../Constants";
import { AuthContext } from "../../../ContextApi";
import {
  cancelReservation, get, submitReview
} from "../../../Services/reservationService";
import AlertDialog from "../../Shared/AlertDialog";
import Skeleton from "../../Shared/Skeletons";
import TableData from "../../Shared/TableData";

export default function Bookings({ currentlySelectedUser, mode }) {
  let { user } = useContext(AuthContext);
  if (currentlySelectedUser) user = currentlySelectedUser;
  const [data, setData] = useState([]);
  const [currentActionItemId, setCurrentActionItemId] = useState(null);
  const [isAlertDialogVisbile, setIsAlertDialogVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getRequiredFormData = data => {
    const currentDate = moment().format();
    let result = [];
    data.forEach(item => {
      if (item?.bike) item["model"] = item?.bike["model"]
      if (moment(item?.startTime).isAfter(currentDate)) item["status"] = "Reserved";
      else if (moment(item?.endTime).isBefore(currentDate)) item["status"] = "Completed";
      result.push(item);
    });
    return result;
  }

  useEffect(() => {
    setTimeout(() => {
      get({ userId: user._id })
        .then(res => {
          setData(getRequiredFormData(res?.data?.reservations),
            toast.success("All Reservations loaded sucessfully")
          )
          setIsLoading(false)
        })
        .catch(err => {
          console.log('------err ', err)
          toast.error("Something went wrong!")
        })
    }, SKELETON_LOAD_TIME)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (action, reservationId) => {
    setCurrentAction(action);
    setIsAlertDialogVisible(true);
    setCurrentActionItemId(reservationId);
  }

  const onDialogClose = actionType => {

    const deleteReservation = () => {
      cancelReservation({ _id: currentActionItemId })
        .then(res =>
          setData(data.filter(item => item._id !== currentActionItemId),
            toast.success("Reservation Cancelled sucessfully")
          ))
        .catch(err => toast.error("Something went wrong"))
    }

    const addReview = () => {
      submitReview({ _id: currentActionItemId, rating: value })
        .then(res =>
          setData(data.filter(item => item._id !== currentActionItemId),
            toast.success("Review submitted sucessfully")
          ))
        .catch(err => toast.error("Something went wrong"))
    }

    const Actions = Object.freeze({
      Completed: addReview,
      Reserved: deleteReservation
    });

    if (actionType === 'confirmed')
      Actions[currentAction]();

    setIsAlertDialogVisible(false);
    setCurrentActionItemId(null);
    setCurrentAction("");
  };

  const bikeRatings = () => {
    return (
      <AlertDialog open={isAlertDialogVisbile} onDialogClose={onDialogClose}>
        <DialogTitle id="alert-dialog-title">
          Please rate your experience
        </DialogTitle>
        <DialogContent>
          <Rating
            name="simple-controlled"
            value={value}
            size={"large"}
            sx={{ paddingLeft: "15%" }}
            onChange={(event, newValue) => {
              setValue(newValue);
            }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onDialogClose("cancel")}>Cancel</Button>
          <Button onClick={() => onDialogClose("confirmed")} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </AlertDialog>
    );
  };

  const getActionItems = () => {
    const IconsLookup = Object.freeze({
      InProgress: (data, id) => null,
      Completed: (data, id) => <RateReviewIcon onClick={() => handleClick(data, id)} />,
      Reserved: (data, id) => <DeleteIcon onClick={() => handleClick(data, id)} />,
    });

    data.forEach((booking) => {
      booking.rowIcon =
        <Fragment>
          {IconsLookup[booking.status](booking.status, booking._id)}
        </Fragment>
    });
  };

  return (
    <>
      {
        isAlertDialogVisbile ? currentAction === "Reserved" ?
          <AlertDialog open={isAlertDialogVisbile} onDialogClose={onDialogClose}>
            <DialogTitle id="alert-dialog-title">
              {"Delete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Booking?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => onDialogClose("cancel")}>Cancel</Button>
              <Button onClick={() => onDialogClose("confirmed")} autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </AlertDialog>
          : bikeRatings() : null
      }
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          {!data.length && !isLoading ? "No Bookings Found" : mode === "view-reservations" ? "Bookings" : "My Bookings"}
        </Typography>

      </Container>
      <Container maxWidth="lg" component="main">
        {
          isLoading ?
            <Skeleton
              number={[0, 1, 2, 3, 4, 5, 6]}
              variant="Rectangle"
              width={1200}
              height={12}
              md={12}
            /> : data.length ?
              <TableData
                data={data}
                TableHeads={BOOKINGS_TABLE_HEADINGS}
                handleClick={handleClick}
                actionItems={getActionItems()}
                shouldDisplayActions={mode !== "view-reservations"}
              /> : null
        }
      </Container>
    </>
  );
}
