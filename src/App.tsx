import { useLayoutEffect, useState } from 'react';
import { AreaChartStacked } from './components/single-input/area-chart-stacked';
import React from 'react';
import ReactDOM from 'react-dom';

export default function App() {
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    window.React = React;
    window.ReactDOM = ReactDOM;
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="semaphor-custom">
      <AreaChartStacked />
    </div>
  );
}
