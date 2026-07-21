import Background from "./Background";

export default function AuthLayout({ left, right }) {
  return (
    <div className="relative min-h-screen overflow-hidden">

      <Background />

      <div className="relative z-10 min-h-screen">

        <div
          className="
            mx-auto
            flex
            min-h-screen
            max-w-[1700px]
            flex-col
            lg:flex-row
          "
        >

          {/* Left */}
          <div
            className="
              flex
              w-full
              lg:w-1/2
              items-center
              justify-center
              px-10
              py-16
            "
          >
            {left}
          </div>

          {/* Right */}
          <div
            className="
              flex
              w-full
              lg:w-1/2
              items-center
              justify-center
              px-10
              py-16
            "
          >
            {right}
          </div>

        </div>

      </div>

    </div>
  );
}