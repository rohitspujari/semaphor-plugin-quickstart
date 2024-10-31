const imageUrl = new URL('../../assets/logo.png', import.meta.url).href;
import { useEffect, useState } from 'react';
import { SingleInputVisualProps } from '../types';

export function CardOne({ data, settings }: SingleInputVisualProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    console.log('name', name);
    setName('John Doe');
  }, [setName, name]);
  // render a table
  const renderData = () => {
    if (!data) return null;

    const orientation = settings?.['orientation'] || 'horizontal';

    return (
      <div>
        <div>{orientation}</div>
        <table>
          <tbody>
            {data?.map((item, index) => {
              return (
                <tr className="border-b border-gray-200" key={index}>
                  {Object.values(item).map((value, index) => {
                    return (
                      <td className="p-2" key={index}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-md p-5 space-y-2">
      <p className="text-lg font-bold">I am Card One</p>
      {renderData()}
      <img className="w-10 h-10" src={imageUrl} alt="My Image" />
    </div>
  );
}
