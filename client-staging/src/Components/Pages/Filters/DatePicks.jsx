import {
  Button, Grid, TextField
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { useState } from "react";


export default function DatePicks({ start = "", end = "", setTimer }) {
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const searchState = (startDate === endDate
    || [startDate, endDate].includes(""))
    || (startDate === start && end === endDate);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <DateTimePicker
            label="Start time"
            value={startDate}
            onChange={(newValue) => {
              if (endDate.$d && moment(newValue.$d).isAfter(endDate.$d))
                setEndDate(newValue);
              setStartDate(newValue);
            }}
            disablePast={true}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DateTimePicker
            label="End Time"
            value={endDate}
            onChange={(newValue) => {
              if (startDate.$d && moment(newValue.$d).isBefore(startDate.$d))
                setStartDate(newValue);
              setEndDate(newValue);
            }}
            disablePast={true}
            // minDateTime={currentDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Button
          disabled={searchState} onClick={() => setTimer(startDate, endDate)} variant={"contained"}>{"search"}</Button>
      </Grid>
    </LocalizationProvider>
  );
}
