import React, { useEffect, useState } from "react";

import {
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const PredictionChart = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/dashboard/history"
      );

      const data = await response.json();

      const chartData = data
        .reverse()
        .map((item) => ({
          time: new Date(item.prediction_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          passengers: item.predicted_passengers,
        }));

      setHistory(chartData);
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

  return (
    <Box
      sx={{
        background: "#1E293B",
        borderRadius: 4,
        p: 3,
        height: "100%",
        color: "#F8FAFC",
        boxShadow: "0 8px 20px rgba(0,0,0,.3)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color="white"
        mb={3}
      >
        Passenger Trend
      </Typography>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <AreaChart data={history}>
          <defs>
            <linearGradient
              id="colorPassengers"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#3B82F6"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#3B82F6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="time"
            stroke="#CBD5E1"
          />

          <YAxis
            stroke="#CBD5E1"
          />

          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "none",
              borderRadius: 10,
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="passengers"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#colorPassengers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PredictionChart;