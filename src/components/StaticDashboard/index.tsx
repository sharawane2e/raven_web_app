import { Grid } from "@material-ui/core";
import DoshboardChart from "../../assets/svg/statics-chart.svg";
import Carousel from 'react-material-ui-carousel';
import {ReactComponent as SlideFirst} from "../../assets/svg/slide1.svg";
import {ReactComponent as Slidesecond} from "../../assets/svg/slide2.svg";

export interface StaticDashboardProps {
  onActionClick: () => void;
}
const StaticDashboard: React.FC<StaticDashboardProps> = (props) => {
  return (
    <Carousel>
      <div>
         <SlideFirst />
      </div>
      <div>
         <Slidesecond />
      </div>
    </Carousel>
  );
};

export default StaticDashboard;
