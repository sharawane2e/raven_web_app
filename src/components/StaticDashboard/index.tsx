import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Tooltip,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import DoshboardChart from "../../assets/svg/dashboard-chart.svg";
import LocalStorageUtils from "../../utils/LocalStorageUtils";

const StaticDashboard: React.FC = () => {
  const user = LocalStorageUtils.getUser();
  return (
    <div className="info-area">
      <h2>Don’t react, anticipate demand</h2>
      <ul>
        <li>
          “HFS OneOffice Pulse” is designed to focus on anticipated demand
          changes for technology and business services.  We envision it to be
          the ultimate semi-annual guide to technology and business services
        </li>
        <li>
          Organizations that will thrive in the pandemic economy must be in step
          with and ultimately anticipate customer requirements and expectations.
          They will need to become pre-emptive in every sense of the word.
        </li>
      </ul>
      <Grid container>
        <Grid item md={6} sm={6} className="info-area__imgwider">
          <img src={DoshboardChart} />
        </Grid>
        <Grid item md={6} sm={6}>
          <h2>Demographics:</h2>
          <ul>
            <li>
              800 respondents across the enterprises with more than $500M
              revenues
            </li>
            <li>45% North America, 35% Europe, 20% RoW</li>
            <li>60%+ C-level respondents</li>
            <li>60% business stakeholders and 40% IT stakeholders</li>
            <li>
              Roughly equal split across major industries that HFS tracks incl.
              BFS; insurance; healthcare & life sciences; Technology, media &
              telecom; energy & utilities; retail & CPG; industrial
              manufacturing; and travel, hospitality, & logistics
            </li>
          </ul>
        </Grid>
      </Grid>
      <Grid>
        <Tooltip title="Feature under construction" arrow placement="top">
          <>
            <FormControlLabel
              label="Don't show this page again?"
              control={<Checkbox disabled />}
            />

            <Button className="button--primary" disabled>
              Go to dashboard
            </Button>
          </>
        </Tooltip>
      </Grid>
    </div>
  );
};

export default StaticDashboard;
