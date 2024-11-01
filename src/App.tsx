// import { AreaChartStacked } from './components/single-input/area-chart-stacked';
// import { BarChartMultiple } from './components/single-input/bar-chart-multiple';
import { HorizontalBarChart } from './components/single-input/horizontal-bar-chart';

export default function App() {
  const data = [
    {
      'customer_name': 'Aaron Hawkins',
      'count': 4,
      'avg_sales': 77.8555,
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
      'avg_sales': 887.7376,
      'max_discount': 0,
      'sum_quantity': 12,
    },
    {
      'customer_name': 'Adam Hart',
      'count': 1,
      'avg_sales': 841.568,
      'max_discount': 0,
      'sum_quantity': 2,
    },
    {
      'customer_name': 'Adam Shillingsburg',
      'count': 7,
      'avg_sales': 181.4662857142857,
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
      'avg_sales': 132.92033333333333,
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
      'avg_sales': 14.208,
      'max_discount': 0,
      'sum_quantity': 5,
    },
  ];

  // const data = [
  //   { month: 'January', desktop: 186, mobile: 80, vr: 13.3 },
  //   { month: 'February', desktop: 305, mobile: 200, vr: 22 },
  //   { month: 'March', desktop: 237, mobile: 120, vr: 22 },
  //   { month: 'April', desktop: 73, mobile: 190, vr: 22 },
  //   { month: 'May', desktop: 209, mobile: 130, vr: 22 },
  //   { month: 'June', desktop: 214, mobile: 140, vr: 22 },
  //   { month: 'July', desktop: 214, mobile: 140, vr: 22 },
  // ];
  return (
    <div className="semaphor-custom ">
      {/* <div className="mx-10 p-10 size-96 bg-gray-100 rounded-lg"> */}
      <HorizontalBarChart data={data} />
      {/* </div> */}
    </div>
  );
}
