import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { 
  Grid, 
  Rating, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardHeader 
} from "@mui/material";
import { Fragment, useContext } from "react";
import CornerRibbon from "react-corner-ribbon";
import { INITIAL_FILTER } from "../../../Constants";
import { AuthContext } from "../../../ContextApi";

export default function BikeCards({ bikes, handleReservationActions }) {
  const { user } = useContext(AuthContext);
  const isManager = user?.role === "MANAGER";
  const getActionItems = (tier) => {
    const allowedAction = isManager ? "Edit Details" : "Book Now";
    return (
      <Fragment>
        <Button
          fullWidth
          variant={'contained'}
          onClick={() => handleReservationActions(tier._id, allowedAction)}
        >
          {allowedAction}
        </Button>
        {
          isManager ?
            <Button
              fullWidth
              variant={'contained'}
              onClick={() => handleReservationActions(tier._id, "Delete")}
            >
              Delete
            </Button>
            : null
        }
      </Fragment>
    )
  };

  const BikeRatings = ({ count, value }) => {
    return (
      <div style={{ display: "flex" }}>
        <Box sx={{ mr: 1 }}>{`(${count})`}</Box>
        <Rating
          precision={.1}
          readOnly
          value={value}
        />
      </div>
    );
  };

  return (
    <Grid container spacing={5} alignItems="flex-end" sx={{ mt: 3 }}>
      {bikes?.map((tier) => (
        <Grid item key={tier._id} xs={12} md={4}>
          <Card sx={{
            position: "relative",
            ':hover': {
              boxShadow: 15,
            },
          }}>
            {
              tier?.isReserved && isManager &&
              <CornerRibbon
                position="top-left"
                fontColor="#f0f0f0"
                backgroundColor="#0971f1"
              >
                Reserved
              </CornerRibbon>
            }
            <CardHeader
              titleTypographyProps={{ align: "center" }}
              action={<BikeRatings count={tier.count} value={tier.rating} />}
              subheaderTypographyProps={{
                align: "center",
              }}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[700],
              }}
            />
            <CardContent>
              <Box
                sx={{
                  alignItems: "baseline",
                  position: 'absolute',
                  mb: 2,
                }}
              >
              </Box>
              <DirectionsBikeIcon sx={{
                textAlign: "center",
                alignItems: "center",
                width: '4rem',
                height: '4rem',
                margin: '1rem 0 1.5rem 8rem',
                color: `${tier.color}`
              }} />
              <ul>
                {
                  Object.keys(INITIAL_FILTER).map((line, index) => (
                    <Typography
                      component="li"
                      variant={line === 'model' ? 'h5' : 'h7'}
                      align="center"
                      key={index}
                    >
                      {tier[line]}
                    </Typography>
                  ))
                }
              </ul>
            </CardContent>
            <CardActions>
              {getActionItems(tier)}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
