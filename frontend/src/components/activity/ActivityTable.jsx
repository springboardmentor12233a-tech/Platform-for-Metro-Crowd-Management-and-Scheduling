import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import StatusBadge from "./StatusBadge";
import ActionBadge from "./ActionBadge";

dayjs.extend(relativeTime);

export default function ActivityTable({
  logs,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
}) {
  const SortableHeader = ({ field, label }) => (
    <th
      onClick={() => onSort(field)}
      className="cursor-pointer select-none px-5 py-4 text-left hover:bg-gray-200"
    >
      <div className="flex items-center gap-2">
        {label}

        {sortField === field && (
          <span>
            {sortDirection === "asc" ? "▲" : "▼"}
          </span>
        )}
      </div>
    </th>
  );

  if (logs.length === 0) {
    return (
      <div className="mt-6 rounded-xl bg-white p-10 text-center shadow">
        <p className="text-gray-500">
          No activity logs match the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr className="text-left text-sm font-semibold text-gray-600">

            <SortableHeader
              field="user_name"
              label="User"
            />

            <SortableHeader
              field="role"
              label="Role"
            />

            <SortableHeader
              field="action"
              label="Action"
            />

            <SortableHeader
              field="module"
              label="Module"
            />

            <th className="px-5 py-4">Target</th>

            <SortableHeader
              field="status"
              label="Status"
            />

            <th className="px-5 py-4">IP Address</th>

            <SortableHeader
              field="created_at"
              label="Created"
            />

          </tr>

        </thead>

        <tbody>

          {logs.map((log) => (

            <tr
              key={log.id}
              onClick={() => onRowClick(log)}
              className="cursor-pointer border-t transition hover:bg-gray-50"
            >

              <td className="px-5 py-4 font-medium text-gray-800">
                {log.user_name}
              </td>

              <td className="px-5 py-4">
                {log.role}
              </td>

              <td className="px-5 py-4">
                <ActionBadge action={log.action} />
              </td>

              <td className="px-5 py-4">
                {log.module}
              </td>

              <td className="px-5 py-4">
                {log.target}
              </td>

              <td className="px-5 py-4">
                <StatusBadge status={log.status} />
              </td>

              <td className="px-5 py-4 text-sm text-gray-500">
                {log.ip_address}
              </td>

              <td className="px-5 py-4">

                <div className="font-medium">
                  {dayjs(log.created_at).format(
                    "DD MMM YYYY"
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  {dayjs(log.created_at).fromNow()}
                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}