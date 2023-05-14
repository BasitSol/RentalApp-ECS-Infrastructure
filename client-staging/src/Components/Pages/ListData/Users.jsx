import {
  Delete as DeleteIcon, EventAvailable as EventAvailableIcon, ModeEdit as ModeEditIcon
} from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { Container, Typography } from "@mui/material/";
import { Fragment, useEffect, useState } from "react";
import toaster from "react-hot-toast";
import {
  ALL_USERS_TABLE, SKELETON_LOAD_TIME
} from "../../../Constants";
import { deleteUser, get } from "../../../Services/usersService";
import AlertDialog from "../../Shared/AlertDialog";
import Skeleton from "../../Shared/Skeletons";
import TableData from "../../Shared/TableData";
import UserForm from "../Forms/UserForm";
import Bookings from "./Bookings";

export default function Users() {

  const [usersList, setUsersList] = useState([]);
  const [isAlertDialogVisbile, setisAlertDialogVisible] = useState(false);
  const [currentActionItemId, setCurrentActionItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAction, setCurrentAction] = useState('');

  useEffect(() => {
    setTimeout(() => {
      get()
        .then(res => {
          updateList(res?.data?.users || []);
          setIsLoading(false)
        })
        .catch(err => toaster.error('Something went Wrong. Can\'t load the content'));
    }, SKELETON_LOAD_TIME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const afterSubmit = (payload) => {
    let currentUser = usersList.find((user) => user._id === currentActionItemId);
    if (!currentUser) {
      console.log("user not found");
      return;
    }

    Object.keys(payload).forEach((key) => {
      currentUser[key] = payload[key];
    });
    updateList(usersList);
    setisAlertDialogVisible(false);
  };

  const handleClick = (action, userId) => {
    switch (action) {
      case "delete":
      case "edit":
        setCurrentActionItemId(userId);
        setisAlertDialogVisible(true);
        setCurrentAction(action);
        break;

      case "view-reservations":
        setCurrentActionItemId(userId);
        setCurrentAction(action);
        setisAlertDialogVisible(true);
        break;
      default:
        console.log("Required action not found");
    }
  };

  const updateList = (list) => {
    getActionItems(list);
    setUsersList(list);
  };

  const updateUsersList = () => {
    updateList(usersList.filter(user => user._id !== currentActionItemId));
    setisAlertDialogVisible(false);
    setCurrentActionItemId(null);
    setCurrentAction("");
  };

  const onDialogClose = (actionType) => {
    if (actionType === "confirmed") {
      deleteUser(currentActionItemId).then(res => {
        updateUsersList();
      })
        .catch(err => console.log("err", err));
    }
    else {
      setisAlertDialogVisible(false);
      setCurrentActionItemId(null);
      setCurrentAction("");
    }
  };

  const getActionItems = (list) => {
    list.forEach((user) => {
      user.rowIcon =
        <Fragment>
          <ModeEditIcon onClick={() => handleClick("edit", user._id)} />
          <DeleteIcon onClick={() => handleClick("delete", user._id)} />
          {
            user.role === "USER" ?
              <EventAvailableIcon onClick={() => handleClick("view-reservations", user._id)} />
              : null
          }
        </Fragment>
    });
  };

  return (
    <>
      {
        (
          isAlertDialogVisbile ?
            currentAction === "delete" ?
              <AlertDialog open={isAlertDialogVisbile} onDialogClose={onDialogClose}>
                <DialogTitle id="alert-dialog-title">
                  {"Delete"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this user?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => onDialogClose("cancel")}>Cancel</Button>
                  <Button onClick={() => onDialogClose("confirmed")} autoFocus>
                    Confirm
                  </Button>
                </DialogActions>
              </AlertDialog>
              : currentAction === "edit" ?
                <AlertDialog open={isAlertDialogVisbile} onDialogClose={onDialogClose}>
                  <UserForm
                    mode={"edit"}
                    user={usersList.find((user) => user._id === currentActionItemId)}
                    afterSubmit={afterSubmit}
                  />
                </AlertDialog>
                : currentAction === "view-reservations" ?
                  <AlertDialog
                    maxWidth={true}
                    fullWidth={true}
                    open={isAlertDialogVisbile}
                    onDialogClose={onDialogClose}
                    styles={{ width: "80%", ml: "10%", pb: "10%" }}
                  >
                    <Bookings
                      currentlySelectedUser={usersList.find((user) => user._id === currentActionItemId)}
                      mode={currentAction}
                    />
                  </AlertDialog>
                  : null : null
        )
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
          All Users
        </Typography>
      </Container>
      <Container maxWidth="lg" component="main">
        {
          isLoading ?
            <Skeleton
              number={[0, 1, 2, 3, 4, 5, 6]}
              variant="Rectangle"
              width={1150}
              height={12}
              md={12}
            /> :
            <TableData
              TableHeads={ALL_USERS_TABLE}
              data={usersList}
              handleClick={handleClick}
            />
        }
      </Container>
    </>
  );
}
