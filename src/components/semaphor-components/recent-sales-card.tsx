import { SingleInputVisualProps } from '../types';

const sampleData: Record<string, string | number>[] = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: 1999,
  },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: 39 },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: 299,
  },
  { name: 'William Kim', email: 'will@email.com', amount: 99 },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39 },
];

export function RecentSales({ data }: SingleInputVisualProps) {
  if (!data || data?.length === 0) return null;

  const records = data || sampleData;

  // get the column keys of the data
  const keys = Object.keys(data[0]);

  // calculate the total sales
  const totalSales = data.reduce(
    (acc, record) => acc + Number(record?.[keys[2]]),
    0
  );
  // format total sales to 2 decimal places and add $ with commas
  const formattedTotalSales = totalSales
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="px-4 bg-background rounded-lg">
      <h2 className="text-lg font-semibold">Recent Sales</h2>
      <p className="text-sm text-muted-foreground mb-4">
        You made {formattedTotalSales} sales this month.
      </p>
      <ul className="p-0">
        {records.map((record, index) => (
          <li
            key={index}
            className=" flex items-center justify-between py-2 border-b border-muted last:border-none"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-black font-bold">
                {record[keys[0]]
                  ?.toString()
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="ml-3">
                <p className="font-medium text-foreground">
                  {record?.[keys[0]]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {record?.[keys[1]]}
                </p>
              </div>
            </div>
            <p className="font-semibold text-foreground">{record?.[keys[2]]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
