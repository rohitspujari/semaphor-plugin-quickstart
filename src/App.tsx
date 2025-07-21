import { MyTable } from './components/semaphor-components/my-table';

export default function App() {
  const data = [
    {
      'customer_name': 'Aaron Hawkins',
      'count': 4,
      'avg_sales': 77.85,
      'max_discount': 0,
      'sum_quantity': 17,
    },
    {
      'customer_name': 'Aaron Smayling',
      'count': 1,
      'avg_sales': 65.78,
      'max_discount': 0,
      'sum_quantity': 11,
    },
    {
      'customer_name': 'Adam Bellavance',
      'count': 5,
      'avg_sales': 887.73,
      'max_discount': 0,
      'sum_quantity': 12,
    },
    {
      'customer_name': 'Adam Hart',
      'count': 1,
      'avg_sales': 841.56,
      'max_discount': 0,
      'sum_quantity': 2,
    },
    {
      'customer_name': 'Adam Shillingsburg',
      'count': 7,
      'avg_sales': 181.46,
      'max_discount': 0,
      'sum_quantity': 25,
    },
    {
      'customer_name': 'Adrian Barton',
      'count': 1,
      'avg_sales': 117.96,
      'max_discount': 0,
      'sum_quantity': 2,
    },
    {
      'customer_name': 'Adrian Shami',
      'count': 2,
      'avg_sales': 27.32,
      'max_discount': 0,
      'sum_quantity': 8,
    },
    {
      'customer_name': 'Aimee Bixby',
      'count': 6,
      'avg_sales': 132.92,
      'max_discount': 0,
      'sum_quantity': 20,
    },
    {
      'customer_name': 'Alan Dominguez',
      'count': 2,
      'avg_sales': 89.72,
      'max_discount': 0,
      'sum_quantity': 7,
    },
    {
      'customer_name': 'Alan Haines',
      'count': 2,
      'avg_sales': 14.2,
      'max_discount': 0,
      'sum_quantity': 5,
    },
  ];

  // return (
  //   <div className="semaphor-custom ">
  //     {/* semaphor-custom class is required for styles to work during development */}
  //     <div className="w-[600px] h-[700px] mx-auto outline overflow-y-auto">
  //       <MyTable data={data} />
  //     </div>
  //   </div>
  // );
  return (
    // <div className="semaphor-custom ">
    <div className="w-[600px] h-[700px] mx-auto mt-10 border border-border rounded-lg px-4 py-6 overflow-y-auto">
      <MyTable data={data} />
    </div>
    // </div>
  );
}
