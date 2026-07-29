import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Box,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

const Navbar = ({ toggleSidebar }) => {

  return (

    <AppBar
      elevation={0}
      position="sticky"
      sx={{
        background: "#111827",
        borderBottom: "1px solid #334155",
      }}
    >

      <Toolbar>

        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: "white",
            mr: 2,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            color: "#F8FAFC",
          }}
        >
          MetroFlow AI Dashboard
        </Typography>

        <Badge
          badgeContent={3}
          color="error"
          sx={{ mr: 3 }}
        >
          <NotificationsNoneRoundedIcon />
        </Badge>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >

          <Typography
            sx={{
              color: "#CBD5E1",
            }}
          >
            Admin
          </Typography>

          <Avatar
            sx={{
              bgcolor: "#2563EB",
            }}
          >
            A
          </Avatar>

        </Box>

      </Toolbar>

    </AppBar>

  );

};

export default Navbar;