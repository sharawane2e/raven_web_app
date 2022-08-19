import "./Objectives.scss";
import { ReactComponent as ResearchObjective } from "../../assets/svg/research_objective.svg";
// import { ReactComponent as BusinessObjective } from "../../assets/svg/business_objective.svg";
import { ReactComponent as BusinessObjective } from "../../assets/svg/business_objective_final.svg";
import { ReactComponent as SHFFinancial } from "../../assets/svg/SHF_Financial_Logo.svg";

import Methodology from "../Methodology";
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
            </div>
          </div>

          <div className="objectives--content">
            <ResearchObjective />
            <div className="objectives--content--text objectives--content--border">
              <p>
                <b className="objectives--content--text objectives--content--text--blue">
                  Research Objective:{" "}
                </b>
                Key objectives for this research include:
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
      <Methodology />
    </div>
  );
};

export default Objectives;
