import "./Objectives.scss";
import { ReactComponent as ResearchObjective } from "../../assets/svg/research_objective.svg";
import { ReactComponent as BusinessObjective } from "../../assets/svg/business_objective.svg";
import { ReactComponent as Nationally } from "../../assets/svg/nationally.svg";
import { ReactComponent as BrazilFlog } from "../../assets/svg/brazilFlag.svg";
import { ReactComponent as ChinaIconFlag } from "../../assets/svg/chinaFlag.svg";
import { ReactComponent as GermanyIconFlag } from "../../assets/svg/germanyFlag.svg";
import { ReactComponent as JapanIconFlag } from "../../assets/svg/japanFlag.svg";
import { ReactComponent as UkFlag } from "../../assets/svg/ukFlag.svg";
import { ReactComponent as UsFlag } from "../../assets/svg/usFlag.svg";
import { ReactComponent as Other } from "../../assets/svg/Other.svg";

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
                BI has defined obesity as an area of strategic importance and is
                investigating several compounds in clinical development, mainly
                injectables. However, basic data on PwO is missing and BI does
                not have a clear understanding of who these individuals are.
              </p>
            </div>
          </div>

          <div className="objectives--content">
            <ResearchObjective />
            <div className="objectives--content--text objectives--content--border">
              <p>
                <b className="objectives--content--text objectives--content--text--blue">
                  Research Objective:
                </b>
                : Research is needed to understand which criteria distinguish
                PwO from the general population, validate hypotheses and explore
                some of the myths surrounding this population.
              </p>
            </div>
          </div>
          <div className="objectives--content">
            <Nationally />
            <div className="objectives--content--text objectives--content--border">
              <p>
                <b className="objectives--content--text objectives--content--text--blue">
                  Nationally representative sample
                </b>
                : For each market the sample is nationally represented
              </p>
            </div>
          </div>
        </div>

        <div className="clearAll"></div>
      </div>
      <div className="nation-container">
        <div className="nation-container__card">
          <div className="nation-container__left">
            <BrazilFlog />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>966</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <ChinaIconFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>781</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <GermanyIconFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>790</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <JapanIconFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>662</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <UsFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>1142</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <UkFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>703</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <Other />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>5044</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Objectives;
