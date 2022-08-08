import Objectives from '../Objectives';
import Methodology from '../Methodology';
import DoshboardChart from "../../assets/svg/popup_icon.svg"

import {
  CarouselProvider,
  Slider,
  Slide,
  Dot,
  Image,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import BackgroundMethodology from '../BackgroundMethodology';
import BusinessObjective from '../BusinessObjective';
import { Grid } from '@material-ui/core';

export interface StaticDashboardProps {
  onActionClick: () => void;
}
const StaticDashboard: React.FC<StaticDashboardProps> = (props) => {
  return (
    
    <div className="info-area">
      <h2 className="info-area__heading">NielsenIQ BASES</h2>
      <h3 className="info-area__subhead">Attribution Quad Maps</h3>
      <span>Interpretation on headline results provided for detailed report</span>
      <p>What are the key strengths and weaknesses of the product which matter to consumers?  Where are the opportunities for substantial performance improvement?</p>
     
      <Grid container>
        <Grid item md={6} sm={6}>
          <h3 className="info-area__subhead">Basic Benefits</h3>
          <ul>
            <li>I like that is low in fat</li>
            <li>Fits well with the brand</li>
            <li>60%+ C-level respondents​</li>
            <li>Is suitable for the whole family</li>
          </ul>
          <h3 className="info-area__subhead">Key Strengths</h3>
          <ul>
            <li>Is made by a brand i trust</li>
            <li>Is deal as a snack</li>
            <li>i like that it contains corn</li>
            <li>Is a light snack</li>
          </ul>
        </Grid>
        <Grid item md={6} sm={6} className="info-area__imgwider">
          <img src={DoshboardChart} />
        </Grid>
      </Grid>
    </div>
  );
};

export default StaticDashboard;
