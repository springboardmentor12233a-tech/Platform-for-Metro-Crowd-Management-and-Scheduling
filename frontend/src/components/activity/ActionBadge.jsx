export default function ActionBadge({ action }) {
  const styles = {
    Login: "bg-blue-100 text-blue-700",
    Logout: "bg-gray-200 text-gray-700",

    "Create User": "bg-green-100 text-green-700",
    "Update User": "bg-orange-100 text-orange-700",
    "Delete User": "bg-red-100 text-red-700",

    "Generate Report": "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[action] || "bg-gray-100 text-gray-700"
      }`}
    >
      {action}
    </span>
  );
}