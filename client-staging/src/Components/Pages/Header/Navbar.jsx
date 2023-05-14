import { Button, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Fragment, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../ContextApi";
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography
            onClick={() => navigate("/")}
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, cursor: "pointer" }}
          >
            <DirectionsBikeIcon sx={{
                width: "4rem",
                height: "4rem",
                marginLeft: "1.5rem",
                marginTop: "0.5rem"
              }} />
          </Typography>
          {user?.role === "USER" ?
            <nav>
              <Link
                variant="button"
                color="text.primary"
                to="/my-bookings"
                style={{ marginRight: 15.5, textDecoration: "none" }}
              >
                My Bookings
              </Link>
            </nav> : null
          }
          {user?.role === "MANAGER" ?
            <nav>
              <Link
                variant="button"
                color="text.primary"
                to="/all-users"
                style={{ marginRight: 15.5, textDecoration: "none" }}
              >
                All Users
              </Link>
            </nav> : null
          }
          <Button
            onClick={() => navigate(user?._id ? "/signin" : "/signup")}
            variant="outlined"
            sx={{ my: 1, mx: 1.5 }}
          >
            {user?._id ? 'logout' : 'SignUp'}
          </Button>

        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
