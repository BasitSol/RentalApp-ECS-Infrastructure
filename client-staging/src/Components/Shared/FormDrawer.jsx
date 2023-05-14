import {
  DirectionsBike, PersonAddAlt as PersonAddAltIcon
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List, ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";


export default function FormDrawer({
  children,
  handleOpen,
  handleClose,
  handleAction,
}) {
  const items = Object.freeze({
    "Create new user": <PersonAddAltIcon />,
    "Add new bike": <DirectionsBike />,
  });

  const list = (anchor) => (
    <>
      {children ? (
        children
      ) : (
        <Box
          sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
          role="presentation"
          onKeyDown={handleClose}
        >
          <List>
            {Object.keys(items).map((text, index) => (
              <ListItem
                key={index}
                disablePadding
                onClick={() => handleAction(text)}
              >
                <ListItemButton>
                  <ListItemIcon> {items[text]} </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
  );

  return (
    <div>
      <Drawer anchor={"right"} open={handleOpen} onClose={handleClose}>
        {list("right")}
      </Drawer>
    </div>
  );
}
