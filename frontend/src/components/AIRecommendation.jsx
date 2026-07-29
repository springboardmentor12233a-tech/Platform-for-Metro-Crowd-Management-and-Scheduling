import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import TrainIcon from "@mui/icons-material/Train";
import TrafficIcon from "@mui/icons-material/Traffic";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import RouteIcon from "@mui/icons-material/Route";

const AIRecommendation = () => {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/dashboard/latest"
      );

      const data = await response.json();
      setLatest(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: 420,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#1E293B",
          borderRadius: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!latest || latest.message) {
    return (
      <Box
        sx={{
          background: "#1E293B",
          borderRadius: 4,
          p: 4,
        }}
      >
        <Typography color="white">
          No recommendation available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "#1E293B",
        borderRadius: 4,
        p: 3,
        color: "#F8FAFC",
        height: "100%",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <SmartToyIcon
          sx={{
            color: "#3B82F6",
            fontSize: 32,
            mr: 1,
          }}
        />

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          AI Recommendation
        </Typography>
      </Box>

      <Divider
        sx={{
          mb: 3,
          borderColor: "#334155",
        }}
      />

      {/* Route */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <RouteIcon
          sx={{
            color: "#60A5FA",
            mr: 1,
          }}
        />

        <Box>
          <Typography
            variant="body2"
            color="#94A3B8"
          >
            Route
          </Typography>

          <Typography fontWeight="bold">
            {latest.from_station} ➜ {latest.to_station}
          </Typography>
        </Box>
      </Box>

      {/* Crowd */}

      <Chip
        icon={<TrafficIcon />}
        label={latest.crowd_level}
        color={
          latest.crowd_level === "HIGH"
            ? "error"
            : latest.crowd_level === "MODERATE"
            ? "warning"
            : "success"
        }
        sx={{
          mb: 3,
          fontWeight: "bold",
        }}
      />

      {/* Platform */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <DirectionsSubwayIcon
          sx={{
            color: "#22C55E",
            mr: 1,
            mt: 0.3,
          }}
        />

        <Box>
          <Typography
            variant="body2"
            color="#94A3B8"
          >
            Platform Status
          </Typography>

          <Typography fontWeight="bold">
            {latest.platform_status}
          </Typography>
        </Box>
      </Box>

      {/* Extra Trains */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <TrainIcon
          sx={{
            color: "#A855F7",
            mr: 1,
            mt: 0.3,
          }}
        />

        <Box>
          <Typography
            variant="body2"
            color="#94A3B8"
          >
            Extra Trains
          </Typography>

          <Typography fontWeight="bold">
            {latest.extra_trains}
          </Typography>
        </Box>
      </Box>

      {/* AI Suggestion */}

      <Box
        sx={{
          mt: 2,
          p: 2.5,
          borderRadius: 3,
          background: "#0F172A",
          border: "1px solid #334155",
        }}
      >
        <Typography
          sx={{
            color: "#3B82F6",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          Suggested Action
        </Typography>

        <Typography
          color="#CBD5E1"
          lineHeight={1.8}
        >
          {latest.recommendation}
        </Typography>
      </Box>
    </Box>
  );
}
export default AIRecommendation;