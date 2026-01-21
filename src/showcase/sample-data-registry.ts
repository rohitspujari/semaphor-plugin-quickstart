import * as salesDashboardData from '../components/semaphor-components/summary-table/summary-table.data';
import * as myTableData from '../components/semaphor-components/my-table/my-table.data';
import * as sankeyChartData from '../components/semaphor-components/sankey-chart/sankey-chart.data';
import * as expandableTableData from '../components/semaphor-components/expandable-table/expandable-table.data';
import * as chipFilterData from '../components/semaphor-components/chip-filter/chip-filter.data';
import * as multiKpiGridData from '../components/semaphor-components/multi-kpi-grid/multi-kpi-grid.data';

export const sampleDataRegistry: Record<
  string,
  {
    // For visuals
    sampleData?: any;
    sampleSettings?: any;
    sampleTheme?: any;
    sampleTabMetadata?: any;
    sampleCardMetadata?: any;
    // For filters
    sampleOptions?: any;
    sampleSelectedValues?: any;
  }
> = {
  // Visuals
  ExpandableTable: expandableTableData,
  SankeyChart: sankeyChartData,
  SummaryTable: salesDashboardData,
  MyTable: myTableData,
  MultiKpiGrid: multiKpiGridData,
  // Filters
  ChipFilter: chipFilterData,
};
