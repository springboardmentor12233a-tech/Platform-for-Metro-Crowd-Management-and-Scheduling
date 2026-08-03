export default function ConfidenceSlider({

  value,

  setValue,

}) {

  return (

    <div>

      <div className="mb-3 flex items-center justify-between">

        <span className="font-medium">

          Confidence Threshold

        </span>

        <span className="font-bold text-blue-600">

          {value}%

        </span>

      </div>

      <input

        type="range"

        min="80"

        max="100"

        value={value}

        onChange={(e) => setValue(e.target.value)}

        className="w-full accent-blue-600"

      />

    </div>

  );

}