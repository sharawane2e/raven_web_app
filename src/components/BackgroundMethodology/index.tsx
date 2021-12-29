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

const BackgroundMethodology = (props: Props) => {
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
              Background + Methodology
            </Typography>
          </Grid>
          <Grid item xs={6}>
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
                  Hard Rock recognizes the need to build its foundational
                  knowledge of the online and physical betting market and a
                  baseline reading of its brand health in New Jersey.
                </Typography>

                <Typography
                  variant="h3"
                  component="h3"
                  className="backgroundMethodology__businessObjective__card__para"
                >
                  Hard Rock is focused on{" "}
                  <span>
                    understanding its target audience, increasing awareness,
                    customer acquisition and market share Hard Rock Casino and
                    Hard Rock Sportsbook offering.
                  </span>{" "}
                  This includes uncovering the nuances that come up with the
                  Hard Rock brand name and how that name might be helpful (or
                  not) in gaining credibility for Hard Rock Sportsbook.
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
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
                  <p>Two main research objectives include:</p>
                  <span>Target Audience Deep Dive:</span> Profile the online casino and
                  sports better in New Jersey- understand who they are, how they
                  engage with betting (currently and in the future) and key
                  barriers and drivers to betting (in general and with Hard Rock
                  Sportsbook specifically). See how Hard Rock Sportsbook
                  compares to key competitors
                </Typography>

                <Typography
                  variant="h3"
                  component="h3"
                  className="backgroundMethodology__businessObjective__card__para"
                >
                  <span>Brand Health:</span> Uncover current brand awareness and
                  perceptions (and set a baseline for ongoing measurement)
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <div className="backgroundMethodology__businessObjective__card__quickView">
                <Grid
                  item
                  xs={2}
                  className="backgroundMethodology__businessObjective__card__quickView__card"
                >
                  <div className="backgroundMethodology__businessObjective__card__quickView__card__inner">
                    {/* <OnlineSurveyImg /> */}
                    <img src={OnlineSurveyImg} alt="Logo"  className="backgroundMethodology__businessObjective__card__quickView__card__inner__img"/>
                    <Typography
                      variant="h3"
                      component="h3"
                      className="backgroundMethodology__businessObjective__card__quickView__card__inner__para"
                    >
                      Online Survey
                      <br />
                      (On any device)
                    </Typography>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={2}
                  className="backgroundMethodology__businessObjective__card__quickView__card"
                >
                  <div className="backgroundMethodology__businessObjective__card__quickView__card__inner">
                    {/* <NjRtesidents /> */}
                    <img src={NjRtesidents} alt=""  className="backgroundMethodology__businessObjective__card__quickView__card__inner__img" />
                    <Typography
                      variant="h3"
                      component="h3"
                      className="backgroundMethodology__businessObjective__card__quickView__card__inner__para"
                    >
                      NJ Residents =500
                    </Typography>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={2}
                  className="backgroundMethodology__businessObjective__card__quickView__card"
                >
                  <div className="backgroundMethodology__businessObjective__card__quickView__card__inner">
                    {/* <AdultsImg /> */}
                    <img src={AdultsImg} alt="" className="backgroundMethodology__businessObjective__card__quickView__card__inner__img"  />
                    <Typography
                      variant="h3"
                      component="h3"
                      className="backgroundMethodology__businessObjective__card__quickView__card__inner__para"
                    >
                      Adults 21+
                    </Typography>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={2}
                  className="backgroundMethodology__businessObjective__card__quickView__card"
                >
                  <div className="backgroundMethodology__businessObjective__card__quickView__card__inner">
                    {/* <SurveyedImg /> */}
                    <img src={SurveyedImg} alt="" className="backgroundMethodology__businessObjective__card__quickView__card__inner__img"/>
                    <Typography
                      variant="h3"
                      component="h3"
                      className="backgroundMethodology__businessObjective__card__quickView__card__inner__para"
                    >
                      Surveyed December 2021
                    </Typography>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={2}
                  className="backgroundMethodology__businessObjective__card__quickView__card"
                >
                  <div className="backgroundMethodology__businessObjective__card__quickView__card__inner">
                    <img src={AddressImg} alt="" className="backgroundMethodology__businessObjective__card__quickView__card__inner__img"/>
                    <Typography
                      variant="h3"
                      component="h3"
                      className="backgroundMethodology__businessObjective__card__quickView__card__inner__para"
                    >
                      New Jersey, US
                    </Typography>
                  </div>
                </Grid>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className="backgroundMethodology__businessObjective">
              <div className="backgroundMethodology__businessObjective__card">
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="h3"
                          component="h3"
                          className="backgroundMethodology__businessObjective__card__para"
                        >
                          <strong>NOTE TO THE READER:</strong> Throughout the report
                          we primarily analyze the data among these key groups
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <div className="backgroundMethodology__businessObjective__card__noteReader">
                          <Typography
                            variant="h3"
                            component="h3"
                            className="backgroundMethodology__businessObjective__card__noteReader__casinoHeading"
                          >
                            Online Casino Player (n=?)
                          </Typography>

                          <Typography
                            variant="h3"
                            component="h3"
                            className="backgroundMethodology__businessObjective__card__para"
                          >
                            MUST be <strong>predominantly</strong> a 'Current Online <strong> Casino
                            Player'</strong>. May also be an 'Online Sports Bettor' but
                            if they are both, they must participate in online
                            casino MORE often (at QA4A)
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className="backgroundMethodology__businessObjective__card__noteReader__border">
                          <Typography
                            variant="h3"
                            component="h3"
                            className="backgroundMethodology__businessObjective__card__noteReader__sportsHeading"
                          >
                            Online Sports Bettor (n=?)
                          </Typography>
                          <Typography
                            variant="h3"
                            component="h3"
                            className="backgroundMethodology__businessObjective__card__para"
                          >
                            MUST be <strong>predominantly</strong> a 'Current Online <strong>Sports
                            Bettor</strong>'. May also be an 'Online Casino Player' but
                            if they are both, they must participate in online
                            sports MORE often (at QA4A)
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="h3"
                          component="h3"
                          className="backgroundMethodology__businessObjective__card__para"
                        >
                          Note on significance testing
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                          <div className="backgroundMethodology__businessObjective__card__significanceTesting">

                          <img src={UpArrowImg} alt="" className="backgroundMethodology__businessObjective__card__significanceTesting__img"/>
                        <Typography
                          variant="h3"
                          component="h3"
                          className="backgroundMethodology__businessObjective__card__significanceTesting__para"
                        >
                          Significantly higher than the corresponding subgroup
                          at 95% significance.
                        </Typography>
                          </div>
                      </Grid>
                      <Grid item xs={12}>
                      <div className="backgroundMethodology__businessObjective__card__significanceTesting">

                          <img src={DownArrowImg} alt="" className="backgroundMethodology__businessObjective__card__significanceTesting__img"/>
                        <Typography
                          variant="h3"
                          component="h3"
                          className="backgroundMethodology__businessObjective__card__significanceTesting__para"
                        >
                          Significantly lower than the corresponding subgroup at
                          95% significance.
                        </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default BackgroundMethodology;
