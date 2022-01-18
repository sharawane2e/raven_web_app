import "./statisPage.scss";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import OnlineSurveyImg from "../../assets/images/online_surveyImg.png";
import NjRtesidents from "../../assets/images/nj_rtesidents.png";
import AdultsImg from "../../assets/images/adultsImg.png";
import SurveyedImg from "../../assets/images/surveyed.png";
import AddressImg from "../../assets/images/addressImg.png";
import UpArrowImg from "../../assets/images/up.png";
import DownArrowImg from "../../assets/images/down.png";

import CustomScrollbar from "../CustomScrollbar";
import { Typography } from "@material-ui/core";

interface Props {}

const BusinessObjective = (props: Props) => {
  return (
    <div className="backgroundMethodology">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              component="h3"
              className="backgroundMethodology__heading"
            >
              {/* Background + Methodology */}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div className="backgroundMethodology__businessObjective">
              <div className="backgroundMethodology__businessObjective__card">
                <Typography
                  variant="h3"
                  component="h3"
                  className="backgroundMethodology__businessObjective__card__heading"
                >
                  Business Objective
                </Typography>
                <Typography
                  variant="h3"
                  component="h3"
                  className="backgroundMethodology__businessObjective__card__para"
                >
                  In order to better meet the needs of existing and potential clients and to successfully grow our business, it is important to understand the perspectives of executive level financial officers at both public and private institutions and corporations. Specifically, we need to:
                  <ul>
                    <li>Better understand our target audience</li>
                    <li>Increase awareness of our brand among high value customers</li>
                    <li>Acquire key high value customers</li>
                    <li>Grow our market share in key geographic regions</li>
                  </ul>

                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="backgroundMethodology__businessObjective">
              <div className="backgroundMethodology__businessObjective__card">
                <Typography
                  variant="h3"
                  component="h3"
                  className="backgroundMethodology__businessObjective__card__heading"
                >
                  Research Objective
                </Typography>
                <Typography
                  variant="h3"
                  component="h3"
                  className="backgroundMethodology__businessObjective__card__para"
                >
                  Key objectives for this research include:
                  <ul>
                    <li>Understand how innovation and enterprise-wide performance management are viewed and planned for </li>
                    <li>Understand the type and extent of changes to performance management systems that are expected to contribute to business growth in terms of people, processes, and technologie</li>
                  </ul>
                  
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="backgroundMethodology__businessObjective">
              <div className="">
                <Typography
                  variant="h3"
                  component="h3"
                  className="backgroundMethodology__businessObjective__card__para"
                >
                  Online survey: LOI = 13 minutes<br />
                  Sample size: N=500<br />
                  Demographic target: Global, minimum n=25 per country<br />
                  Industry target: CFO, VP of Finance<br />
                  Field dates:  July 6 to 27, 2021<br />

                </Typography>
              </div>
            </div>
          </Grid>
         
        </Grid>
      </Box>
    </div>
  );
};

export default BusinessObjective;
