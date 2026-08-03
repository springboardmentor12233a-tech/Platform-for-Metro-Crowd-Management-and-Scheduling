export default function SaveBar({ visible }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-2xl">

      <span className="font-medium text-slate-700">
        You have unsaved changes.
      </span>

      <button className="rounded-xl border px-4 py-2">
        Cancel
      </button>

      <button className="rounded-xl bg-blue-600 px-5 py-2 text-white">
        Save Changes
      </button>

    </div>
  );
}