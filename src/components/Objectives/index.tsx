import React from "react";
import "./Objectives.scss";
import { ReactComponent as ResearchObjective } from "../../assets/svg/research_objective.svg";
import { ReactComponent as BusinessObjective } from "../../assets/svg/business_objective.svg";
import { ReactComponent as HardrockLogo } from "../../assets/svg/hardrock_logo.svg";
import Methodology from "../Methodology";
interface Props {}

const Objectives = (props: Props) => {
  return (
    <>
      {" "}
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
                Hard Rock recognizes the need to build its foundational
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
                There are two main research objectives :
              </p>
              <ul>
                <li>
                  <p>
                    <b>Target Audience Deep Dive: </b>Profile the target
                    audience – understand who they are, how they engage with
                    sports currently and in the future, and key barriers and
                    drivers.
                  </p>
                </li>
                <li>
                  <p>
                    <b>Brand Health: </b>Uncover current brand awareness and
                    perceptions, and set a baseline for ongoing measurement.
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="objectives--content"></div>
        </div>
        <div className="objectives--container container--right">
          <HardrockLogo className="objectives--container container--right-svg" />
        </div>
      </div>
      <Methodology />
    </>
  );
};

export default Objectives;
