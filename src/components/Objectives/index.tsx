import React from "react";
import "./Objectives.scss";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { ReactComponent as ResearchObjective } from "../../assets/svg/research_objective.svg";
import { ReactComponent as BusinessObjective } from "../../assets/svg/business_objective.svg";
import { ReactComponent as SHFFinancial } from "../../assets/svg/SHF_Financial_Logo.svg";

import { ReactComponent as OnlineSurveyIcon } from "../../assets/svg/online_survey.svg";
import { ReactComponent as CalendarIcon } from "../../assets/svg/calendar_icon.svg";
import { ReactComponent as TotalRBIcon } from "../../assets/svg/total_RB.svg";
import { ReactComponent as PopulationIcon } from "../../assets/svg/population.svg";
import { ReactComponent as FolridaMapIcon } from "../../assets/svg/florida_map.svg";

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
                  Business Objective:{" "}
                </b>{" "}
                : Hard Rock recognizes the need to build its foundational
                knowledge and gain a baseline reading of its brand health. Hard
                Rock is focused on:
              </p>
              <ul>
                <li>
                  <p>Understanding its target audience</p>
                </li>
                <li>
                  <p>Increasing awareness</p>
                </li>
                <li>
                  <p>Customer acquisition</p>
                </li>
                <li>
                  <p>Building market share</p>
                </li>
              </ul>
              <p>
                This includes uncovering nuances that arise with the Hard Rock
                brand name and how that name might be helpful in gaining
                credibility for additional brands
              </p>
            </div>
          </div>

          <div className="objectives--content">
            <ResearchObjective />
            <div className="objectives--content--text objectives--content--border">
              <p>
                <b className="objectives--content--text objectives--content--text--blue">
                  Research Objective:{" "}
                </b>
                There are two main research objectives:
              </p>
              <ul>
                <li>
                  <p>
                    <strong>Target Audience Deep Dive:</strong>Profile the
                    target audience – understand who they are, how they engage
                    with sports currently and in the future, and key barriers
                    and drivers.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Brand Health:</strong>Uncover current brand
                    awareness and perceptions, and set a baseline for ongoing
                    measurement.
                  </p>
                </li>
                {/* 
                <li>
                  <p>Acquire key high value customers</p>
                </li>
                <li>
                  <p>Grow our market share in key geographic regions</p>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        <div className="objectives--container container--right">
          <SHFFinancial className="objectives--container container--right-svg" />
        </div>
        <div className="clearAll"></div>
      </div>
      <h2>OBJECTIVES</h2>
      <div className="carousal-section">
        <Grid container justifyContent="center" spacing={2}>
          {/* {[0, 1, 2,3,4].map((value) => ( */}
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <OnlineSurveyIcon />
              </div>
              <div className="card-title">Online Survey</div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <TotalRBIcon />
              </div>
              <div className="card-title">
                Total = 1,000 Florida Residents = 800 Florida Visitors = 200
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <PopulationIcon />
              </div>
              <div className="card-title">Population:Ages 21+</div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <FolridaMapIcon />
              </div>
              <div className="card-title">
                Profile the sports bettor in Florida
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 180, width: 20 }}>
              <div className="card-image">
                <CalendarIcon />
              </div>
              <div className="card-title">Fielded:August 2021</div>
            </Paper>
          </Grid>
          {/* ))} */}
        </Grid>
      </div>
    </div>
  );
};

export default Objectives;
