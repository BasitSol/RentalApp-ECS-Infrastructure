import {
  Box,
  Button, Container, FormControl, Grid, InputLabel, MenuItem,
  Select, TextField, Typography
} from "@mui/material";
import { Fragment } from "react";
import toaster from "react-hot-toast";
import { ROLES } from "../../../Constants";
import useForm from "../../../Services/CustomHooks/useForm";
import { create, update } from "../../../Services/usersService";
import validate from "../../../ValidationRules";


export default function UserForm({ mode, user, afterSubmit }) {

  const handleSubmit = (event) => {

    const handleSubmitResponse = () => {
      toaster.success("New User added Successfully!")
      if (afterSubmit) afterSubmit(values);
    };

    let promise = null;
    if (mode === "edit") {
      delete values.password;
      promise = update(values, user._id);
    }
    else promise = create(values);

    promise
      .then(res => handleSubmitResponse())
      .catch(err => toaster.error("Failed to Create a new User!"));
  };

  const defaultValues = user ? {
    email: user?.email || '',
    name: user?.name || '',
    role: user?.role || 'USER',
  } : {
    email: '',
    name: '',
    role: 'USER',
    password: '',
    confirmPassword: ''
  };

  const {
    values,
    errors,
    handleChangeValidation,
    handleSubmitValidation,
  } = useForm(handleSubmit, validate, defaultValues);


  // const submitButtonState = !!Object.values(values).filter(value => !value).length;
  const title = mode === "edit" ? "Update User" : "Create New User";
  const submitBtnTitle = mode === "edit" ? "Update" : "Add";

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
          {title}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmitValidation} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="name"
                required
                fullWidth
                id="name"
                label={errors.name ? errors.name : "Name"}
                onChange={handleChangeValidation}
                autoFocus
                value={values.name}
                error={!!errors.name}
              />
            </Grid>
            <Grid item lg={12}>
              <FormControl fullWidth>
                <InputLabel id="role-select">Role</InputLabel>
                <Select
                  labelId="role-select"
                  id="role-simple-select"
                  value={values.role}
                  label={errors.role ? errors.role : "Role"}
                  onChange={handleChangeValidation}
                  name="role"
                >
                  {
                    ROLES.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label={errors.email ? errors.email : "Email Address"}
                name="email"
                onChange={handleChangeValidation}
                autoComplete="email"
                value={values.email}
                error={!!errors.email}
              />
            </Grid>
            {
              (
                mode !== 'edit' ?
                  <Fragment>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label={errors.password ? errors.password : "Password"}
                        type="password"
                        id="password"
                        onChange={handleChangeValidation}
                        autoComplete="new-password"
                        value={values.password}
                        error={!!errors.password}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label={errors.confirmPassword ? errors.confirmPassword : "Confirm Password"}
                        type="password"
                        onChange={handleChangeValidation}
                        id="confirmPassword"
                        value={values.confirmPassword}
                        error={!!errors.confirmPassword}
                      />
                    </Grid>
                  </Fragment>
                  : null
              )
            }
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            // disabled={submitButtonState}
            sx={{ mt: 3, mb: 2 }}
          >
            {submitBtnTitle}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
