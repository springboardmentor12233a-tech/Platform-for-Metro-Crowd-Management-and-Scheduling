import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

import { stationData } from "../data/metroData";

function getChipColor(status) {
  switch (status) {
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

function CongestionTable() {
  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 4,
        boxShadow: 4,
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Congestion Tracking
        </Typography>

        <TableContainer component={Paper}>

          <Table>

            <TableHead
              sx={{
                backgroundColor: "#1976d2",
              }}
            >
              <TableRow>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Station
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Occupancy
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Status
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Recommendation
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {stationData.map((station) => (

                <TableRow
                  key={station.id}
                  hover
                >

                  <TableCell>
                    {station.station}
                  </TableCell>

                  <TableCell>
                    {station.occupancy}%
                  </TableCell>

                  <TableCell>

                    <Chip
                      label={station.status}
                      color={getChipColor(station.status)}
                      sx={{ fontWeight: "bold" }}
                    />

                  </TableCell>

                  <TableCell>
                    {station.recommendation}
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </TableContainer>

      </CardContent>
    </Card>
  );
}

export default CongestionTable;