import { Grid } from "@material-ui/core";
import DoshboardChart from "../../assets/svg/statics-chart.svg";
import Carousel from 'react-material-ui-carousel';
import SlideFirst from "../../assets/svg/slide1.svg";
import Slidesecond from "../../assets/svg/slide2.svg";

export interface StaticDashboardProps {
  onActionClick: () => void;
}
const StaticDashboard: React.FC<StaticDashboardProps> = (props) => {
  return (
    <Carousel>
      <div>
         <img src={SlideFirst}></img>
      </div>
      <div>
        <img src={Slidesecond}></img>
      </div>
    </Carousel>
  );
};

export default StaticDashboard;
