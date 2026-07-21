import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

function MapControls({
  zoomIn,
  zoomOut,
  resetTransform,
}) {
  return (
    <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-3 bg-white rounded-2xl shadow-xl border border-slate-200 p-2">

      <button
        onClick={() => zoomIn()}
        className="p-3 rounded-xl hover:bg-slate-100"
      >
        <ZoomIn size={22} />
      </button>

      <button
        onClick={() => zoomOut()}
        className="p-3 rounded-xl hover:bg-slate-100"
      >
        <ZoomOut size={22} />
      </button>

      <button
        onClick={() => resetTransform()}
        className="p-3 rounded-xl hover:bg-slate-100"
      >
        <RotateCcw size={22} />
      </button>

    </div>
  );
}

export default MapControls;