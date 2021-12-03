import { Grid } from "@material-ui/core";
import DoshboardChart from "../../assets/svg/statics-chart.svg";
import Carousel from "react-material-ui-carousel";
import SlideFirst from "../../assets/svg/slide1.svg";
import Slidesecond from "../../assets/svg/slide2.svg";
import Objectives from "../Objectives";
import Methodology from "../Methodology";

export interface StaticDashboardProps {
  onActionClick: () => void;
}
const StaticDashboard: React.FC<StaticDashboardProps> = (props) => {
  return (
    <Carousel>
      <div>
        <Objectives />
      </div>
      {/* <div>
        <Methodology />
      </div> */}
    </Carousel>
  );
};

export default StaticDashboard;
