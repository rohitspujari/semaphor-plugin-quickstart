import { Data } from '../types';

type CardTwoProps = {
  data: Record<string, string | number | boolean>[];
  settings?: Record<string, string | number | boolean>;
};

export function CardTwo({ data, settings }: CardTwoProps) {
  // render a table
  const renderData = (data: Data) => {
    if (!data) return null;
    const orientation = settings?.['orientation'] || 'horizontal';

    return (
      <div>
        <p>{orientation}</p>
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
      <p className="text-lg font-bold">I am Card Two</p>
      {renderData(data)}
    </div>
  );
}
