export default function SaveBar({
  visible,
  onSave,
  onCancel,
  saving = false,
}) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-2xl">

      <span className="font-medium text-slate-700">
        You have unsaved changes.
      </span>

      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}