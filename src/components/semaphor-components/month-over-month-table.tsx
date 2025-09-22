import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Info,
  ImageIcon,
  MoreVertical,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { SingleInputVisualProps } from '../config-types';

export function MonthOverMonthTable({ data, settings }: SingleInputVisualProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['North']));
  const [showVolume, setShowVolume] = useState(false);
  const [showMyMills, setShowMyMills] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['Jan', 'Feb', 'Nov', 'Dec']);
  const [additionalColumn, setAdditionalColumn] = useState('YoY');

  if (!data || data?.length === 0) return null;

  const title = settings?.title || 'Industry commodity index trends by region';
  const subtitle =
    settings?.subtitle ||
    'Davis Insight weighted index changes by region for selected commodities under Busheling/Clips, from Feb 2025, in USD/mt.';

  const toggleExpanded = (region: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(region)) {
      newExpanded.delete(region);
    } else {
      newExpanded.add(region);
    }
    setExpandedRows(newExpanded);
  };

  const formatChange = (change: number) => {
    const formatted = Math.abs(change).toFixed(2) + '%';
    return change >= 0 ? formatted : formatted;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const handleMonthToggle = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const renderRow = (item: any, index: number) => {
    const isRegion = item.category === 'region';
    const hasChildren = isRegion && data.some((d: any) => d.parent === item.region);
    const isExpanded = expandedRows.has(item.region);
    const shouldShow = item.level === 0 || (item.parent && expandedRows.has(item.parent));

    if (!shouldShow) return null;

    return (
      <tr
        key={index}
        className={`border-b border-border hover:bg-muted/50 ${
          item.level > 0 ? 'bg-muted/20' : ''
        }`}
      >
        <td className="px-4 py-3 text-left">
          <div className={`flex items-center ${item.level > 0 ? 'ml-6' : ''}`}>
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(item.region)}
                className="mr-2 p-1 hover:bg-muted rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {!hasChildren && item.level > 0 && (
              <span className="mr-2 p-1">
                <span className="text-muted-foreground">+</span>
              </span>
            )}
            {!hasChildren && item.level === 0 && (
              <span className="mr-2 p-1">
                <span className="text-muted-foreground">−</span>
              </span>
            )}
            <span className={`${isRegion ? 'font-medium' : ''}`}>{item.region}</span>
          </div>
        </td>
        {selectedMonths.includes('Feb') && (
          <>
            <td className="px-4 py-3 text-right font-mono text-sm">{item.feb2025}</td>
            <td className="px-4 py-3 text-right">
              <span className={`text-sm font-medium ${getChangeColor(item.feb2025_change)}`}>
                {formatChange(item.feb2025_change)}
              </span>
            </td>
          </>
        )}
        {selectedMonths.includes('Jan') && (
          <>
            <td className="px-4 py-3 text-right font-mono text-sm">{item.jan2025}</td>
            <td className="px-4 py-3 text-right">
              <span className={`text-sm font-medium ${getChangeColor(item.jan2025_change)}`}>
                {formatChange(item.jan2025_change)}
              </span>
            </td>
          </>
        )}
        {selectedMonths.includes('Dec') && (
          <>
            <td className="px-4 py-3 text-right font-mono text-sm">{item.dec2024}</td>
            <td className="px-4 py-3 text-right">
              <span className={`text-sm font-medium ${getChangeColor(item.dec2024_change)}`}>
                {formatChange(item.dec2024_change)}
              </span>
            </td>
          </>
        )}
        {selectedMonths.includes('Nov') && (
          <>
            <td className="px-4 py-3 text-right font-mono text-sm">{item.nov2024}</td>
            <td className="px-4 py-3 text-right">
              <span className={`text-sm font-medium ${getChangeColor(item.nov2024_change)}`}>
                {formatChange(item.nov2024_change)}
              </span>
            </td>
          </>
        )}
        {additionalColumn === 'YoY' && (
          <>
            <td className="px-4 py-3 text-right font-mono text-sm">{item.yoy}</td>
            <td className="px-4 py-3 text-right">
              <span className={`text-sm font-medium ${getChangeColor(item.yoy_change)}`}>
                {formatChange(item.yoy_change)}
              </span>
            </td>
          </>
        )}
      </tr>
    );
  };

  return (
    <div className="w-full bg-background rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subtitle and Controls */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-my-mills"
              checked={showMyMills}
              onCheckedChange={(checked) => setShowMyMills(checked as boolean)}
            />
            <Label htmlFor="show-my-mills" className="text-sm text-muted-foreground">
              Show only my mills
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-volume" className="text-sm text-muted-foreground">
              Show volume
            </Label>
            <Switch
              id="show-volume"
              checked={showVolume}
              onCheckedChange={setShowVolume}
            />
          </div>
          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h3 className="font-medium text-center">Customize table</h3>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Select Months</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                      'Jul',
                      'Aug',
                      'Sep',
                      'Oct',
                      'Nov',
                      'Dec',
                    ].map((month) => (
                      <div key={month} className="flex items-center space-x-2">
                        <Checkbox
                          id={month}
                          checked={selectedMonths.includes(month)}
                          onCheckedChange={() => handleMonthToggle(month)}
                        />
                        <Label htmlFor={month} className="text-sm">
                          {month}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Additional columns</h4>
                  <RadioGroup value={additionalColumn} onValueChange={setAdditionalColumn}>
                    <div className="grid grid-cols-3 gap-3">
                      {['YTD', 'Q1', 'Q2', 'Q3', 'Q4', 'All months', 'YoY'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  Region / Category / Commodity
                  <ChevronDown className="h-4 w-4" />
                </div>
              </th>
              {selectedMonths.includes('Feb') && (
                <>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      Feb 2025
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      Chg
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                </>
              )}
              {selectedMonths.includes('Jan') && (
                <>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      Jan 2025
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      Chg
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                </>
              )}
              {selectedMonths.includes('Dec') && (
                <>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      Dec 2024
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      Chg
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                </>
              )}
              {selectedMonths.includes('Nov') && (
                <>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      Nov 2024
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      Chg
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                </>
              )}
              {additionalColumn === 'YoY' && (
                <>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      YoY
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                      Chg
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>{data.map((item: any, index: number) => renderRow(item, index))}</tbody>
        </table>
      </div>
    </div>
  );
}