import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";

export default function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/dashboard/history");
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const chipColor = (crowd) => {
    if (!crowd) return "default";

    switch (crowd.toUpperCase()) {
      case "HIGH":
        return "error";
      case "MODERATE":
        return "warning";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        background: "#1E293B",
        borderRadius: 4,
        p: 3,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color="white"
        mb={3}
      >
        Prediction History
      </Typography>

      <Table>

        <TableHead>

          <TableRow
            sx={{
              background: "#0F172A",
            }}
          >

            <TableCell sx={{ color: "#94A3B8", fontWeight: "bold" }}>
              Time
            </TableCell>

            <TableCell sx={{ color: "#94A3B8", fontWeight: "bold" }}>
              From
            </TableCell>

            <TableCell sx={{ color: "#94A3B8", fontWeight: "bold" }}>
              To
            </TableCell>

            <TableCell sx={{ color: "#94A3B8", fontWeight: "bold" }}>
              Passengers
            </TableCell>

            <TableCell sx={{ color: "#94A3B8", fontWeight: "bold" }}>
              Crowd
            </TableCell>

            <TableCell sx={{ color: "#94A3B8", fontWeight: "bold" }}>
              Platform
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {history.map((item, index) => (

            <TableRow
              key={index}
              hover
              sx={{
                "& td": {
                  color: "#E2E8F0",
                },
                "&:hover": {
                  background: "#273449",
                },
              }}
            >

              <TableCell>
                {item.timestamp || item.time}
              </TableCell>

              <TableCell>
                {item.from_station}
              </TableCell>

              <TableCell>
                {item.to_station}
              </TableCell>

              <TableCell>
                {item.predicted_passengers}
              </TableCell>

              <TableCell>
                <Chip
                  label={item.crowd_level}
                  color={chipColor(item.crowd_level)}
                  size="small"
                />
              </TableCell>

              <TableCell>
                {item.platform_status}
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>
    </Paper>
  );
}