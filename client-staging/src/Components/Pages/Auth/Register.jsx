import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useContext } from "react";
import toaster from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../ContextApi";
import { signUpService } from "../../../Services/authService";
import useForm from "./../../../Services/CustomHooks/useForm";
import validate from "./../../../ValidationRules";

const theme = createTheme();

export default function Register() {

  const navigate = useNavigate();
  const { setContextUser } = useContext(AuthContext);
  const handleSubmitResponse = user => setContextUser(user, navigate("/"));

  const handleSubmit = (event) => {
    const data = new FormData(event.target);
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    };
    signUpService(payload)
      .then(res => {
        handleSubmitResponse(res?.data)
        toaster.success('Welcome to Bike Booking App!')
      })
      .catch(err => toaster.error(`Signup Failed due to ${err.status}`));
  };

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const {
    values,
    errors,
    handleChangeValidation,
    handleSubmitValidation,
  } = useForm(handleSubmit, validate, defaultValues);


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmitValidation} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  label={errors.name ? errors.name : "Name"}
                  value={values.name || ''}
                  onChange={handleChangeValidation}
                  required
                  fullWidth
                  id="name"
                  autoFocus
                  error={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={errors.email ? errors.email : "Email Address"}
                  value={values.email || ''}
                  onChange={handleChangeValidation}
                  name="email"
                  autoComplete="email"
                  error={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  type="password"
                  id="password"
                  label={errors.password ? errors.password : "Password"}
                  value={values.password || ''}
                  onChange={handleChangeValidation}
                  autoComplete="new-password"
                  error={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  label={errors.confirmPassword ? errors.confirmPassword : "Confirm Password"}
                  value={values.confirmPassword || ''}
                  onChange={handleChangeValidation}
                  autoComplete="confirm-Password"
                  error={errors.confirmPassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
