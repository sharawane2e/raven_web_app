import './Methodology.scss';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { ReactComponent as OnlineSurveyIcon } from '../../assets/svg/online-survey.svg';
import { ReactComponent as CalendarIcon } from '../../assets/svg/calendar.svg';
import { ReactComponent as PopulationIcon } from '../../assets/svg/population.svg';
import { ReactComponent as FolridaMapIcon } from '../../assets/svg/globe.svg';
import IndustryTargetIcon from '../../assets/images/industry_target.png';

interface Props {}

const Methodology = (props: Props) => {
  return (
    <div className="carousal">
      <div className="header">
        <h1>Methodology</h1>
      </div>
      <div className="carousal-section">
        <Grid container justifyContent="center" spacing={2}>
          {/* {[0, 1, 2,3,4].map((value) => ( */}
          <Grid item>
            <Paper sx={{ height: 208, width: 20 }}>
              <div className="card-image">
                <OnlineSurveyIcon />
              </div>
              <div className="card-title">Online survey: LOI = 13 minutes</div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 208, width: 20 }}>
              <div className="card-image">
                {/* <TotalRBIcon /> */}
                <PopulationIcon />
              </div>
              <div className="card-title">Sample size: N=500</div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 208, width: 20 }}>
              <div className="card-image">
                <img src={IndustryTargetIcon} alt="Industry Target" />
              </div>
              <div className="card-title">
                Industry Target: CFO, VP of Finance{' '}
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 208, width: 20 }}>
              <div className="card-image">
                <FolridaMapIcon />
              </div>
              <div className="card-title">
                Demographic Target: Global, minimum n=25 per country
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ height: 208, width: 20 }}>
              <div className="card-image">
                <CalendarIcon />
              </div>
              <div className="card-title">Field Dates: July 6 to 27, 2021</div>
            </Paper>
          </Grid>
          {/* ))} */}
        </Grid>
        {/* <div className="note-container">
          <div className="note-header">
            <strong>NOTE TO THE READER: </strong>
            <span>
              Throughout the report we primarily analyze the data among these
              key groups
            </span>
          </div>
          <Grid container spacing={2}> */}
        {/* {[0, 1].map((value) => ( */}
        {/* <Grid item xs={6}>
              <div className="note-division">
                <div>
                  <div className="current-division">
                    Current Sports Bettor (n=671)
                  </div>
                  <div>Identify if anyone selected QA5 a-d = 01-03</div>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="note-division">
                <div>
                  <div className="future-division">
                    Current Sports Bettor (n=671)
                  </div>
                  <div>Identify if anyone selected QA5 a-d = 01-03</div>
                </div>
              </div>
            </Grid> */}
        {/* ))} */}
        {/* </Grid>
          <div className="note-subheader">Note on significance testing: </div>
          <Grid container spacing={2}> */}
        {/* {[0, 1].map((value) => ( */}
        {/* <Grid item xs={6}>
              <div className="note-division">
                <div>
                  <div className="up-arrow"></div>
                  <div>
                    Significantly higher than the corresponding subgroup at 95%
                    significance.
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="note-division">
                <div>
                  <div className="up-arrow"></div>
                  <div>
                    Indicates sig. difference = Current Sports Bettor = Future
                    Sports Bettor
                  </div>
                </div>
              </div>
            </Grid> */}
        {/* ))} */}
        {/* </Grid>
        </div> */}
      </div>
    </div>
  );
};

export default Methodology;
