import React from "react";
import "./Objectives.scss";
import { ReactComponent as ResearchObjective } from "../../assets/svg/research_objective.svg";
import { ReactComponent as BusinessObjective } from "../../assets/svg/business_objective.svg";
import { ReactComponent as HardrockLogo } from "../../assets/svg/hardrock_logo.svg";

interface Props {}

const Objectives = (props: Props) => {
  return (
    <div className="objectives">
      <div className="objectives--container container--left">
        <h2>OBJECTIVES</h2>
        <div className="objectives--content">
          <BusinessObjective />
          <div className="objectives--content--text objectives--content--border">
            <p>
              <b className="objectives--content--text objectives--content--text--blue">Business Objective: </b> Hard Rock Sportsbook recognizes the
              need to build its foundational knowledge of the betting market and
              a baseline reading of its brand health in Florida (to start) ahead
              of its launch. Hard Rock Sportsbook is focused on :
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
                <p>Market share for the hard rock sportsbook offering </p>
              </li>
            </ul>
            <p>
              This includes uncovering the nuances that come up with the Hard
              Rock brand name and how that name might be helpful (or not) in
              gaining credibility for Hard Rock Sportsbook
            </p>
          </div>
        </div>
        
        <div className="objectives--content">
          <ResearchObjective />
          <div className="objectives--content--text objectives--content--border">
            <p>
              <b className="objectives--content--text objectives--content--text--blue">Research Objective: </b>: There are two main research objectives :
            </p>
            <ul>
              <li>
              <p>
                  <b>Target Audience Deep Dive: </b>Profile the sports bettor in
                  Florida – understand who they are, how they engage with sports
                  betting (currently and in the future) and key barriers and
                  drivers to sports betting (in general and with Hard Rock
                  Sportsbook specifically). See how Hard Rock Sportsbook
                  compares to key competitors
                </p>
              </li>
              <li>
              <p>
                  <b>Brand Health: </b>Uncover current brand awareness and
                  perceptions (and set a baseline for ongoing measurement)
                </p>
              </li>
            </ul>
          </div>
        </div>
       
      </div>
      <div className="objectives--container container--right">
        <HardrockLogo className="objectives--container container--right-svg" />
      </div>
    </div>
  );
};

export default Objectives;
