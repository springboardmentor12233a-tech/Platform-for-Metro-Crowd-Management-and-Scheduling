import { useEffect, useState } from "react";
import { getActivityLogs } from "../services/activityLogService";

export default function useActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const data = await getActivityLogs();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    refresh: fetchLogs,
  };
}