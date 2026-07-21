import {
  blueLine,
  yellowLine,
  stations,
} from "./networkConfig";

import MetroLine from "./MetroLine";
import MetroStationSVG from "./MetroStationSVG";
import AnimatedTrain from "./AnimatedTrain";

function SVGMetroMap() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">

      <h2 className="text-3xl font-bold mb-6">
        AI Metro Network
      </h2>

      <svg
        width="100%"
        height="600"
        viewBox="0 0 900 600"
      >

        <MetroLine
          path={blueLine}
          color="#2563eb"
        />

        <MetroLine
          path={yellowLine}
          color="#facc15"
        />

        {stations.map((station) => (
          <MetroStationSVG
            key={station.id}
            station={station}
          />
        ))}

        <AnimatedTrain />

      </svg>

    </div>
  );
}

export default SVGMetroMap;