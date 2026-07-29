import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { alertData } from "../data/metroData";

function getAlertIcon(type) {
  switch (type) {
    case "High":
      return <ErrorIcon color="error" />;
    case "Medium":
      return <WarningAmberIcon color="warning" />;
    case "Low":
      return <CheckCircleIcon color="success" />;
    default:
      return <CheckCircleIcon />;
  }
}

function getChipColor(type) {
  switch (type) {
    case "High":
      return "error";
    case "Medium":
      return "warning";
    case "Low":
      return "success";
    default:
      return "default";
  }
}

function Alerts() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 4,
        height: "100%",
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Recent Alerts
        </Typography>

        <List>
          {alertData.map((alert) => (
            <ListItem
              key={alert.id}
              divider
            >
              <ListItemIcon>
                {getAlertIcon(alert.type)}
              </ListItemIcon>

              <ListItemText
                primary={alert.message}
              />

              <Chip
                label={alert.type}
                color={getChipColor(alert.type)}
                size="small"
              />
            </ListItem>
          ))}
        </List>

      </CardContent>
    </Card>
  );
}

export default Alerts;