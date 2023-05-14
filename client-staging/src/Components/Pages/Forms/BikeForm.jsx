import { Container, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import toaster from "react-hot-toast";
import { AVAILABLE_COLORS, AVAILABLE_LOCATIONS, AVAILABLE_MODELS } from "../../../Constants";
import { create, update } from "../../../Services/bikeService";
import useForm from "../../../Services/CustomHooks/useForm";
import validate from "../../../ValidationRules";

export default function BikeForm({ mode, afterSubmit, currentBike }) {

  const handleSubmit = (event) => {
    const data = new FormData(event.target);
    const payload = {
      color: data.get("color"),
      model: data.get("model"),
      location: data.get("location"),
    };
    const handleSubmitResponse = () => {
      if (afterSubmit) afterSubmit(payload);
    };
    const promise = mode === "edit" ? update(payload, currentBike._id) : create(payload);

    promise
      .then(res => {
        handleSubmitResponse()
        toaster.success(`A new ${payload.model} has been created!`)
      })
      .catch(err => toaster.error('Failed to create new bike'));
  };

  const defaultValues = {
    color: currentBike?.color || "",
    model: currentBike?.model || "",
    location: currentBike?.location || ""
  }

  const {
    values,
    errors,
    handleChangeValidation,
    handleSubmitValidation,
  } = useForm(handleSubmit, validate, defaultValues);

  // const submitButtonState = !!(Object.values(values).filter(value => !value).length); 
  const formTitle = mode === 'edit' ? "Edit" : "Add New";
  const btnText = mode === 'edit' ? "Update" : "Add";

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {formTitle} Bike
        </Typography>

        <Box component="form" onSubmit={handleSubmitValidation} sx={{ minWidth: 420 }}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="demo-simple-select-label">{errors.color ? errors.color : "Color"}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.color}
              onChange={handleChangeValidation}
              name="color"
              label={errors.color ? errors.color : "Color"}
              error={!!errors.color}
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
            <InputLabel id="demo-simple-select-label">{errors.model ? errors.model : "Model"}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.model}
              label={errors.model ? errors.model : "Model"}
              onChange={handleChangeValidation}
              name="model"
              error={!!errors.model}
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
            <InputLabel id="demo-simple-select-label">{errors.location ? errors.location : "Location"}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.location}
              label={errors.location ? errors.location : "Location"}
              onChange={handleChangeValidation}
              error={!!errors.location}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {btnText}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
