import * as salesDashboardData from '../components/semaphor-components/summary-table/summary-table.data';
import * as myTableData from '../components/semaphor-components/my-table/my-table.data';
import * as chipFilterData from '../components/semaphor-components/chip-filter/chip-filter.data';

export const sampleDataRegistry: Record<
  string,
  {
    // For visuals
    sampleData?: any;
    sampleSettings?: any;
    sampleTheme?: any;
    // For filters
    sampleOptions?: any;
    sampleSelectedValues?: any;
  }
> = {
  // Visuals
  SummaryTable: salesDashboardData,
  MyTable: myTableData,
  // Filters
  ChipFilter: chipFilterData,
};
