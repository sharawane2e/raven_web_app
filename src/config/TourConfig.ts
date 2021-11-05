import { ITourStep } from "../types/ITourStep";

export const chartTourSteps: ITourStep[] = [
  {
    selector: ".Step-1",
    content: "Select the question you would like to visualize as chart",
  },
  {
    selector: ".Step-2",
    content:
      "Select the question if you want to cross tabulate with the above question. (Optional)",
  },
  {
    selector: ".Step-3",
    content:
      "Select the filters if you want to fine tune the demographic view of the data. (Optional )",
  },
  {
    selector: ".Step-4",
    content: "Click to apply the selected filters",
  },
  {
    selector: ".Step-5",
    content: "Pick the required chart orientation",
  },
  {
    selector: ".Step-6",
    content: "Select chart type to get different chart visualization",
  },
];
