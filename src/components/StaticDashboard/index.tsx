import { Grid } from "@material-ui/core";
import DoshboardChart from "../../assets/svg/statics-chart.svg";
import Carousel from 'react-material-ui-carousel';

export interface StaticDashboardProps {
  onActionClick: () => void;
}
const StaticDashboard: React.FC<StaticDashboardProps> = (props) => {
  return (
    <Carousel>
      <div>
         <h2>Hii</h2>
         <p>How do you do</p>
      </div>
      <div>
         <h2>Hii</h2>
         <p>How do you do 1</p>
      </div>
      <div>
         <h2>Hii</h2>
         <p>How do you do 2</p>
      </div>
    </Carousel>
  );
};

export default StaticDashboard;
