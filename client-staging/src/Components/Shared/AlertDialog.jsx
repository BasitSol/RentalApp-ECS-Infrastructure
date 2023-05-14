import Dialog from '@mui/material/Dialog';

const AlertDialog = ({ open, onDialogClose, children, maxWidth, fullWidth, styles }) => {
  return (
    <>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        sx={styles}
        open={open}
        onClose={() => onDialogClose("cancel")}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {children}
      </Dialog>
    </>
  );
}

export default AlertDialog;
