import { CSVLink } from "react-csv";

export default function ExportCSVButton({ logs }) {
  const headers = [
    { label: "User", key: "user_name" },
    { label: "Role", key: "role" },
    { label: "Action", key: "action" },
    { label: "Module", key: "module" },
    { label: "Target", key: "target" },
    { label: "Status", key: "status" },
    { label: "IP Address", key: "ip_address" },
    { label: "Created At", key: "created_at" },
  ];

  return (
    <CSVLink
      data={logs}
      headers={headers}
      filename={`activity_logs_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`}
      className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
    >
      Export CSV
    </CSVLink>
  );
}