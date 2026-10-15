export const chartTimes = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '23:59']
export function parseChartPoints(points: string) {
  return points.split(' ').map(point => { const [x, y] = point.split(',').map(Number); return { x, y } })
}
// Distribute the sample total across points while preserving its exact sum.
export function chartCounts(points: string, height: number, total: number) {
  const weights = parseChartPoints(points).map(point => height - point.y)
  const sum = weights.reduce((result, weight) => result + weight, 0)
  const values = weights.map(weight => weight / sum * total)
  const counts = values.map(Math.floor)
  const remainder = total - counts.reduce((result, count) => result + count, 0)
  values.map((value, index) => ({ index, fraction: value - counts[index] })).sort((a, b) => b.fraction - a.fraction).slice(0, remainder).forEach(({ index }) => counts[index]++)
  return counts
}
