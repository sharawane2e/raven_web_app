import { Grid } from '@material-ui/core';
import DoshboardChart from '../../assets/svg/statics-chart.svg';

export interface StaticDashboardProps {
  onActionClick: () => void;
}
const StaticDashboard: React.FC<StaticDashboardProps> = (props) => {
  return (
    <div className="info-area">
      <h2 className="info-area__heading">HFS Pulse Dashboard, H3 2022</h2>
      <h2 className="info-area__head">Don’t react, anticipate demand</h2>
      <ul>
        {/* <li>
          “HFS Pulse Dashboard” is designed to focus on anticipated demand
          changes for technology and business services.  We envision it to be
          the ultimate semi-annual guide to technology and business services
        </li> */}
        <li>
          Organizations that will thrive in the pandemic economy must be in step
          with and ultimately anticipate customer requirements and expectations.
          They will need to become pre-emptive in every sense of the word.
        </li>
      </ul>
      <Grid container>
        <Grid item md={6} sm={6} className="info-area__imgwider">
          <img src={DoshboardChart} />
        </Grid>
        <Grid item md={6} sm={6}>
          <h3 className="info-area__subhead">Demographics:</h3>
          <ul>
            <li>
              600 respondents across the enterprises with more than $500M
              revenues
            </li>
            <li>50% North America, 35% Europe, 15% RoW</li>
            <li>34%+ C-level respondents</li>
            <li>65% business stakeholders and 35% IT stakeholders</li>
            <li>
              Roughly equal split across major industries that HFS tracks incl.
              BFS; insurance; healthcare & life sciences; Technology, media &
              telecom; energy & utilities; retail & CPG; industrial
              manufacturing; and travel, hospitality, & logistics
            </li>
          </ul>
        </Grid>
      </Grid>
    </div>
  );
};

export default StaticDashboard;
