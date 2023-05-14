import { Box, Grid, Skeleton } from "@mui/material";

export default function SkeletonTemplate({ number, variant = "Rectangle", width = 240, height = 120, md = 4 }) {

  return (
    <Grid container spacing={5} alignItems="flex-end" sx={{ mt: 3, mb: 4 }}>
      {number?.map((tier, index) => (
        <Grid item key={index} md={md}>
          <Skeleton
            variant={variant}
            width={width}
            height={height}
          />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton width={width} />
            <Skeleton width="40%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
