// Function to generate chart config with round-robin color assignment and skipping specific indices

export type ChartDataItem = Record<string, string | number | boolean>;

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

export function generateChartConfig(
  data: ChartDataItem[],
  skipIndices: number[] = []
): {
  chartConfig: ChartConfig;
  keys: string[];
} {
  // Find the object with the most keys
  const objectWithMostKeys = data.reduce(
    (max, current) =>
      Object.keys(current).length > Object.keys(max).length ? current : max,
    {} as ChartDataItem
  );

  const config: ChartConfig = {};
  let colorIndex = 1;
  const maxColorIndex = 5; // Limit color indexes to 1 through 5

  // Get all keys and filter by index
  Object.keys(objectWithMostKeys).forEach((key, index) => {
    if (!skipIndices.includes(index)) {
      config[key] = {
        label: key?.charAt(0)?.toUpperCase() + key?.slice(1),
        color: `hsl(var(--chart-${colorIndex}))`,
      };
      // Increment colorIndex and reset to 1 if it exceeds maxColorIndex
      colorIndex = colorIndex === maxColorIndex ? 1 : colorIndex + 1;
    }
  });

  return { chartConfig: config, keys: Object.keys(objectWithMostKeys) };
}

// Example usage, skipping keys at index 0 and 2
// const chartConfig = generateChartConfig(chartData, [0, 2]);
// console.log(chartConfig);
