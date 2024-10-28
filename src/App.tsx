// import { useEffect, useState } from 'react';
// import { CardOne } from './components/card-one';
import { DataArray } from './components/types';
import { DisplayCard } from './components/multi-input/display-card';

export default function App() {
  // simulate getting the data from the server with 2 secs delay
  // const [data, setData] = useState<
  //   Record<string, string | number | boolean>[]
  // >([]);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setData([
  //       { name: 'John', age: 20, isActive: true, city: 'New York' },
  //       { name: 'Jane', age: 21, isActive: false, city: 'Los Angeles' },
  //     ]);
  //   }, 2000);
  // }, []);

  const data1 = [
    {
      name: 'John',
      age: 20,
      state: 'NY',
      zip: 10001,
    },
    {
      name: 'Jane',
      age: 21,
      state: 'NY',
      zip: 10002,
    },
  ];

  const data2 = [
    {
      name: 'Rick',
      age: 20,
    },
    {
      name: 'Morty',
      age: 21,
    },
  ];

  const displayCardData: DataArray = [data1, data2];

  return (
    <div className="semaphor-custom">
      <div className="m-10 space-y-2">
        <h1>I am the parent App.jsx</h1>
        {/* <CardOne data={data} /> */}
        <DisplayCard data={displayCardData} />
      </div>
    </div>
  );
}
