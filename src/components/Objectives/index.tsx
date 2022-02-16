import "./Objectives.scss";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { ReactComponent as ResearchObjective } from "../../assets/svg/research_objective.svg";
import { ReactComponent as BusinessObjective } from "../../assets/svg/business_objective.svg";
import { ReactComponent as SHFFinancial } from "../../assets/svg/SHF_Financial_Logo.svg";

import { ReactComponent as OnlineSurveyIcon } from "../../assets/svg/online_survey.svg";
import { ReactComponent as CalendarIcon } from "../../assets/svg/calendar.svg";
import { ReactComponent as TotalRBIcon } from "../../assets/svg/target.svg";
import { ReactComponent as PopulationIcon } from "../../assets/svg/Industry_target.svg";
import { ReactComponent as FolridaMapIcon } from "../../assets/svg/map.svg";

interface Props {}

const Objectives = (props: Props) => {
  return (
    <div className="combinedScreen">
      <div className="objectives">
        <div className="objectives--container container--left">
          <h2>OBJECTIVES</h2>
          <div className="objectives--content">
            <BusinessObjective />
            <div className="objectives--content--text objectives--content--border">
              <p>
                <b className="objectives--content--text objectives--content--text--blue">
                  Business Objective:
                </b>
                In order to better meet the needs of existing and potential
                clients and to successfully grow our business, it is important
                to understand the perspectives of executive level financial
                officers at both public and private institutions and
                corporations. Specifically, we need to:
              </p>
              <ul>
                <li>
                  <p>Better understand our target audience</p>
                </li>
                <li>
                  <p>
                    Increase awareness of our brand among high value customers
                  </p>
                </li>
                <li>
                  <p>Acquire key high value customers</p>
                </li>
                <li>
                  <p>Grow our market share in key geographic regions</p>
                </li>
              </ul>
              {/* <p>
                This includes uncovering the nuances that come up with the Hard
                Rock brand name and how that name might be helpful (or not) in
                gaining credibility for Hard Rock Sportsbook
              </p> */}
            </div>
          </div>

          <div className="objectives--content">
            <ResearchObjective />
            <div className="objectives--content--text objectives--content--border">
              <p>
                <b className="objectives--content--text objectives--content--text--blue">
                  Research Objective:
                </b>
                : Key objectives for this research include:
              </p>
              <ul>
                <li>
                  <p>
                    Understand how innovation and enterprise-wide performance
                    management are viewed and planned for
                  </p>
                </li>
                <li>
                  <p>
                    Understand the type and extent of changes to performance
                    management systems that are expected to contribute to
                    business growth in terms of people, processes, and
                    technologies
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="objectives--container container--right">
          <SHFFinancial className="objectives--container container--right-svg" />
        </div>
        <div className="clearAll"></div>
      </div>

      <div className="carousal-section">
        <h2 className="h2">OBJECTIVES</h2>
        <Grid container justifyContent="center" spacing={2}>
          {/* {[0, 1, 2,3,4].map((value) => ( */}
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <OnlineSurveyIcon />
              </div>
              <div className="card-title">Online Survey</div>
              <div className="card-title card-title-unbold">
                LOI = 13 minutes
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <TotalRBIcon />
              </div>
              <div className="card-title">Sample Size:</div>
              <div className="card-title card-title-unbold">N= 500</div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <PopulationIcon />
              </div>
              <div className="card-title">Industry Target:</div>
              <div className="card-title card-title-unbold">
                CFO, VP of Finance
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <FolridaMapIcon />
              </div>
              <div className="card-title">Demographic Target</div>
              <div className="card-title card-title-unbold">
                Global, minimum
              </div>
              <div className="card-title card-title-unbold">
                n= 25 per country
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <CalendarIcon />
              </div>
              <div className="card-title">Field Dates:</div>
              <div className="card-title card-title-unbold">
                Fielded:August 2021
              </div>
            </Paper>
          </Grid>
          {/* ))} */}
        </Grid>
      </div>
    </div>
  );
};

export default Objectives;
