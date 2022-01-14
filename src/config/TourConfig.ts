import { ITourStep } from "../types/ITourStep";

export const chartTourSteps: ITourStep[] = [
  {
    selector: ".Step-1",
    content: "Select the question to visualize",
  },
  {
    selector: ".Step-2",
    content:
      "Select the question to crosstab with it (Optional)",
  },
  {
    selector: ".Step-3",
    content:
      "Select any filters to focus on part of the data (Optional)",
  },
  {
    selector: ".Step-4",
    content: "Click to apply the selected filters",
  },
  {
    selector: ".Step-5",
    content: "Select the desired chart orientation",
  },
  {
    selector: ".Step-6",
    content: "Select chart type to change the visualization",
  },
];
