function LiveClock() {
  const time = new Date().toLocaleTimeString();

  return (
    <div className="bg-slate-900 text-white rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs text-slate-400">System Time</p>

      <h2 className="text-xl font-bold">
        {time}
      </h2>
    </div>
  );
}

export default LiveClock;