function AnimatedTrain() {
  return (
    <circle
      r="8"
      fill="#4f46e5"
    >
      <animateMotion
        dur="18s"
        repeatCount="indefinite"
        path="M100 260 L250 260 L420 260 L580 260 L760 260"
      />
    </circle>
  );
}

export default AnimatedTrain;