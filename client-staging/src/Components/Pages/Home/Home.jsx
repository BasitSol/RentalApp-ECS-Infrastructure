import {
  Add as AddIcon,
  FilterAlt as FilterAltIcon,
  HighlightOff as HighlightOffIcon
} from "@mui/icons-material";
import {
  Button,
  Container,
  CssBaseline, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, GlobalStyles,
  Typography
} from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import toaster from "react-hot-toast";
import { INITIAL_FILTER, SKELETON_LOAD_TIME } from "../../../Constants";
import { AuthContext } from "../../../ContextApi";
import { deleteBike, getBikes } from "../../../Services/bikeService.js";
import { create } from "../../../Services/reservationService.js";
import AlertDialog from "../../Shared/AlertDialog";
import FormDrawer from "../../Shared/FormDrawer";
import DatePicks from "../Filters/DatePicks";
import RestFilters from "../Filters/RestFilters";
import { BikeForm, UserForm } from "../Forms";
import Skeleton from "./../../Shared/Skeletons";
import BikeCards from "./BikeCards";



const fabStyle = {
  position: "fixed",
  bottom: 16,
  right: 16,
};

function PricingContent() {
  const { user } = useContext(AuthContext);
  const [userForm, setUserForm] = useState(false);
  const [bikeForm, setBikeForm] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bikes, setBikes] = useState([]);
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [filteredData, setFilteredData] = useState(bikes);
  const [isLoading, setIsLoading] = useState(user?.role === "MANAGER");
  const [isAlertDialogVisbile, setisAlertDialogVisible] = useState(false);
  const [currentActionItemId, setCurrentActionItemId] = useState(null);
  const [currentAction, setCurrentAction] = useState('');
  const [clearFilters, setClearFilters] = useState(false);

  useEffect(() => {
    const shouldFetchBikes = (
      (startTime !== endTime &&
        ![startTime, endTime].includes(''))
      || user?.role === "MANAGER"
    );

    if (shouldFetchBikes) fetchBikes();
    else setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  const fetchBikes = () => {
    if (isAlertDialogVisbile) setisAlertDialogVisible(false);
    setTimeout(() => {
      getBikes({ startTime, endTime })
        .then(res => {
          setBikes(res?.data?.bikes);
          setFilteredData(res?.data?.bikes);
          setIsLoading(false);
        })
        .catch(err => {
          toaster.error('Could not search the Bikes!')
        });
    }, SKELETON_LOAD_TIME);
  };

  const setTimer = (startDate, endDate) => {
    setStartTime(startDate)
    setEndTime(endDate)
    setIsLoading(true)
  }

  const applyFilter = (data, remove = false, clearFilter = false) => {
    try {
      setIsLoading(true);
      setShowFilters(false);

      if (clearFilter) {
        data = INITIAL_FILTER;
        setClearFilters(false);
      }
      else if (!remove) {
        setClearFilters(true);
      }

      let result = bikes;
      const Actions = Object.freeze({
        "=": (a, b) => a === b,
        "<": (a, b) => a < b,
        ">": (a, b) => a > b,
      });

      if (data['condition'] && data['ratings']) {
        result = result.filter(item =>
          Actions[data['condition']](item['rating'], data['ratings']));
      }

      Object.keys(data).forEach(key => {
        if (data[key] && !['condition', 'ratings'].includes(key))
          result = result.filter(item => item[key] === data[key]);
      });

      const handleFilter = data => data.filter(item => item?._id !== result[0]?._id);
      if (remove) {
        result = handleFilter(filteredData);
        setBikes(result);
      }
      setFilteredData(result);
      setFilter(data);
    } catch (err) {
      toaster.error('Somthing went wrong');
    } finally {
      setTimeout(() => setIsLoading(false), SKELETON_LOAD_TIME);
    }
  }

  const handleReservationActions = (_id, action) => {
    const createReservation = () => {

      create({ bikeId: _id, startTime, endTime })
        .then(res => {
          toaster.success('Reservation created sucessfully');
          applyFilter({ _id }, true);
        })
        .catch(err => toaster.error('Login Failed!!'));
    }

    const editDetails = () => {
      setisAlertDialogVisible(true);
      setCurrentActionItemId(_id);
    };

    const deleteBike = () => {
      setisAlertDialogVisible(true);
      setCurrentAction(action);
      setCurrentActionItemId(_id);
    };

    const getAction = Object.freeze({
      "Book Now": createReservation,
      "Edit Details": editDetails,
      "Delete": deleteBike
    });

    getAction[action]();
  }

  const handleAction = e => {
    e === "Add new bike"
      ? setBikeForm(true)
      : setUserForm(true);
  }

  const afterDrawerSubmit = () => {
    if (bikeForm) fetchBikes();
    handleCloseDrawer();
  };

  function getChild() {
    if (bikeForm) return <BikeForm afterSubmit={afterDrawerSubmit} />;
    if (userForm) return <UserForm afterSubmit={afterDrawerSubmit} />;

    return null;
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setBikeForm(false);
    setUserForm(false);
  };

  const afterSubmit = () => {
    setCurrentActionItemId(null);
    fetchBikes();
  };

  const onDialogClose = (actionType) => {
    if (actionType === "confirmed") {
      deleteBike(currentActionItemId).then(res => {
        toaster.success('Entry Deleted Successfully!')
        fetchBikes();
      })
        .catch(err => toaster.error('Deletion Failed!'));
    }
    else {
      setisAlertDialogVisible(false);
      setCurrentActionItemId(null);
      setCurrentAction("");
    }
  };

  return (
    <Fragment>
      {
        isAlertDialogVisbile ? currentAction === 'Delete' ?
          <AlertDialog open={isAlertDialogVisbile} onDialogClose={onDialogClose}>
            <DialogTitle id="alert-dialog-title">
              {"Delete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Bike?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => onDialogClose("cancel")}>Cancel</Button>
              <Button onClick={() => onDialogClose("confirmed")} autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </AlertDialog>
          :
          <AlertDialog open={isAlertDialogVisbile} onDialogClose={onDialogClose}>
            <BikeForm
              currentBike={bikes.find((bike) => bike._id === currentActionItemId)}
              mode={"edit"}
              afterSubmit={afterSubmit}
            />
          </AlertDialog>
          : null
      }
      <FormDrawer
        handleAction={handleAction}
        handleOpen={openDrawer}
        handleClose={handleCloseDrawer}
      >
        {getChild()}
      </FormDrawer>
      {
        user?.role === "MANAGER" ?
          <Fab
            color="primary"
            aria-label="add"
            sx={fabStyle}
            onClick={() => setOpenDrawer(true)}
          >
            <AddIcon />
          </Fab>
          : null
      }
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
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
          BOOK BIKES
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          component="p"
        >
          {
            user?.role === "USER" ?
              "Book bikes in seconds !" :
              "Manage book bikes"
          }
        </Typography>
      </Container>

      <Container maxWidth="lg" component="main">
        {user?.role === "USER" &&
          <DatePicks
            start={startTime}
            end={endTime}
            setTimer={setTimer}
          />
        }

        <Button
          size="small"
          disabled={!bikes.length}
          sx={{ height: 54, float: "right", borderRadius: "10%" }}
          onClick={() => setShowFilters(true)}
          variant={"contained"}
          endIcon={<FilterAltIcon />}
        >
          Apply Filters
        </Button>

        {clearFilters ?
          <Button
            size="small"
            disabled={!bikes.length}
            sx={{ mr: "2rem", height: 54, float: "right", borderRadius: "10%" }}
            onClick={() => applyFilter(INITIAL_FILTER, false, true)}
            variant={"contained"}
            endIcon={<HighlightOffIcon />}
          >
            Clear Filters
          </Button>
          : null
        }

        {showFilters && (
          <RestFilters
            applyFilter={applyFilter}
            filter={filter}
            isVisible={true}
            handleClose={() => setShowFilters(false)}
          />
        )}
        {
          isLoading ?
            <Skeleton number={[0, 1, 2, 3, 4]} /> :
            <BikeCards
              handleReservationActions={handleReservationActions}
              bikes={filteredData} />
        }
      </Container><Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
      </Container>
    </Fragment>
  );
}

export default function Home() {
  return <PricingContent />;
}
