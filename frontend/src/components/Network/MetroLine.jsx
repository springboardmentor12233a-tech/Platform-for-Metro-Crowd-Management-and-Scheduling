function MetroLine({
  path,
  color,
}) {
  return (
    <path
      d={path}
      stroke={color}
      strokeWidth="8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export default MetroLine;