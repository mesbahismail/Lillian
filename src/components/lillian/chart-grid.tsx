export function ChartGrid() {
  return <g className="chart-grid" aria-hidden="true">
    {Array.from({ length: 9 }, (_, index) => <line key={index} x1={`${index * 12.5}%`} x2={`${index * 12.5}%`} y1="0" y2="100%" vectorEffect="non-scaling-stroke" />)}
  </g>
}
