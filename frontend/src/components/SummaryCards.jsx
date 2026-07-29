import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrafficIcon from "@mui/icons-material/Traffic";
import TrainIcon from "@mui/icons-material/Train";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";

const SummaryCards = () => {
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!latest || latest.message) {
    return (
      <Typography color="white">
        No prediction available.
      </Typography>
    );
  }

  const cards = [
    {
      title: "Passengers",
      value: latest.predicted_passengers,
      subtitle: "Live Prediction",
      icon: <PeopleAltIcon sx={{ fontSize: 34 }} />,
      color: "#3B82F6",
    },
    {
      title: "Crowd Level",
      value: latest.crowd_level,
      subtitle: "Current Status",
      icon: <TrafficIcon sx={{ fontSize: 34 }} />,
      color: "#F59E0B",
    },
    {
      title: "Platform",
      value: latest.platform_status,
      subtitle: "Availability",
      icon: <DirectionsSubwayIcon sx={{ fontSize: 34 }} />,
      color: "#22C55E",
    },
    {
      title: "Interval",
      value: latest.recommended_train_interval,
      subtitle: "Recommended",
      icon: <TrainIcon sx={{ fontSize: 34 }} />,
      color: "#A855F7",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              background: "#1E293B",
              color: "#F8FAFC",
              borderRadius: 4,
              p: 3,
              transition: "0.3s",
              cursor: "pointer",
              border: "1px solid #334155",
              height: "100%",

              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: `0 0 25px ${card.color}55`,
              },
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "18px",
                background: `${card.color}20`,
                color: card.color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              {card.icon}
            </Box>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {card.value}
            </Typography>

            <Typography
              sx={{
                color: "#CBD5E1",
                mt: 1,
                fontWeight: 500,
              }}
            >
              {card.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                mt: 1,
              }}
            >
              {card.subtitle}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;