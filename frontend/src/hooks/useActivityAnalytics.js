import { useEffect, useState } from "react";
import { getAnalytics } from "../services/activityAnalyticsService";

export default function useActivityAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { analytics, loading };
}