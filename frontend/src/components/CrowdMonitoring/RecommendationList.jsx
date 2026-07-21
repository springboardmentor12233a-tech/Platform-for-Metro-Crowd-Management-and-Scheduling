import {
  CheckCircle2,
} from "lucide-react";

function RecommendationList({
  items = [],
}) {
  return (
    <div className="space-y-2">

      {items.map((item, index) => (
        <div
          key={index}
          className="flex gap-2 items-start"
        >
          <CheckCircle2
            size={16}
            className="text-green-500 mt-1"
          />

          <span className="text-sm">
            {item}
          </span>

        </div>
      ))}

    </div>
  );
}

export default RecommendationList;