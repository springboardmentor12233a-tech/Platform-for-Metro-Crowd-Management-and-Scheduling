import dayjs from "dayjs";

export default function ActivityDetailsDrawer({
  log,
  isOpen,
  onClose,
}) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">

      <div className="h-full w-full max-w-lg bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">
            Activity Details
          </h2>

          <button
            onClick={onClose}
            className="rounded p-2 hover:bg-gray-100"
          >
            ✕
          </button>

        </div>

        <div className="space-y-6 p-6">

          <Info label="User" value={log.user_name} />
          <Info label="Role" value={log.role} />
          <Info label="Action" value={log.action} />
          <Info label="Module" value={log.module} />
          <Info label="Target" value={log.target} />
          <Info label="Status" value={log.status} />
          <Info label="IP Address" value={log.ip_address} />

          <Info
            label="Created"
            value={dayjs(log.created_at).format(
              "DD MMM YYYY HH:mm:ss"
            )}
          />

        </div>

      </div>

    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}