import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, TextField, Typography
} from "@mui/material";
import {
  createTheme,
  ThemeProvider
} from "@mui/material/styles";
import { useContext, useEffect } from "react";
import toaster from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../ContextApi";
import { signInService } from "../../../Services/authService";
import useForm from "./../../../Services/CustomHooks/useForm";
import validate from "./../../../ValidationRules";

const theme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const { setContextUser } = useContext(AuthContext);
  const handleSubmitResponse = user => setContextUser(user, navigate("/"));

  useEffect(() => {
    setContextUser({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSubmit = event => {
    const data = new FormData(event.target);

    signInService({
      email: data.get("email"),
      password: data.get("password"),
    })
      .then(res => {
        toaster.success("Successfully Logged in!")
        handleSubmitResponse(res.data)
      })
      .catch(err => toaster.error("Login Failed!"));
  };

  const defaultValues = {
    email: '',
    password: ''
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmitValidation}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
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
            <TextField
              margin="normal"
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
