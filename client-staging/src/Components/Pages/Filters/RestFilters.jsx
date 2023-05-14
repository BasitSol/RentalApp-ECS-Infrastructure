import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton,
  InputLabel,
  MenuItem, Select
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  AVAILABLE_COLORS, AVAILABLE_LOCATIONS, AVAILABLE_MODELS, CONDITIONS, RATINGS
} from "../../../Constants";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function RestFilters({ isVisible, handleClose, filter, applyFilter }) {
  const [values, setValues] = useState(filter);
  // const [filterState, setFilterState] = useState(true);

  const handleChange = (event) => {
    // setFilterState(false);
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isVisible}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Filter Bikes
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ minWidth: 420 }}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="demo-simple-select-label">Color</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.color}
                label="Color"
                onChange={handleChange}
                name="color"
              >
                {
                  AVAILABLE_COLORS.map((color) => (
                    <MenuItem key={color.value} value={color.value}>
                      {color.label}
                    </MenuItem>))
                }

              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="demo-simple-select-label">Model</InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.model}
                label="Model"
                onChange={handleChange}
                name="model"
              >
                {
                  AVAILABLE_MODELS.map((model) => (
                    <MenuItem key={model.value} value={model.value}>
                      {model.label}
                    </MenuItem>))
                }

              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="demo-simple-select-label">Location</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.location}
                label="Location"
                onChange={handleChange}
                name="location"
              >
                {
                  AVAILABLE_LOCATIONS.map((location) => (
                    <MenuItem key={location.value} value={location.value}>
                      {location.label}
                    </MenuItem>))
                }

              </Select>
            </FormControl>
            <FormControl sx={{ mb: 4, width: '45%' }}>
              <InputLabel id="demo-simple-select-label">Conditions</InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.condition}
                label="Condition"
                onChange={handleChange}
                name="condition"
              >
                {
                  CONDITIONS.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>))
                }

              </Select>
            </FormControl>
            <FormControl sx={{ ml: 4, mb: 4, width: '45%' }}>
              <InputLabel id="demo-simple-select-label">Ratings</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.ratings}
                disabled={!values.condition}
                label="Ratings"
                onChange={handleChange}
                name="ratings"
              >
                {
                  RATINGS.map((rating) => (
                    <MenuItem key={rating} value={rating}>
                      {rating}
                    </MenuItem>))
                }

              </Select>

            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => applyFilter(values, false, true)}
          >
            Clear Filter
          </Button>
          <Button
            autoFocus
            onClick={() => applyFilter(values)}
          >
            Apply Filter
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
