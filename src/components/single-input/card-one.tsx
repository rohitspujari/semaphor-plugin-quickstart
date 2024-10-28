const imageUrl = new URL('../../assets/logo.png', import.meta.url).href;
import { Data } from '../types';

type CardOneProps = {
  data: Data;
  settings?: Record<string, unknown>;
};

export function CardOne({ data, settings }: CardOneProps) {
  // render a table
  const renderData = (data: Data) => {
    if (!data) return null;

    const orientation = settings?.['orientation'] || 'horizontal';

    return (
      <table>
        <div>{orientation as string}</div>
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
    );
  };

  return (
    <div className="border border-gray-200 rounded-md p-5 space-y-2">
      <p className="text-lg font-bold">I am Card One</p>
      {renderData(data)}
      <img className="w-10 h-10" src={imageUrl} alt="My Image" />
    </div>
  );
}
