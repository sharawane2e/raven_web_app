import React from 'react';
import './Objectives.scss';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
import { ReactComponent as ResearchObjective } from '../../assets/svg/research_objective.svg';
import { ReactComponent as BusinessObjective } from '../../assets/svg/business_objective.svg';
import { ReactComponent as Nationally } from '../../assets/svg/nationally.svg';
// import { ReactComponent as SHFFinancial } from '../../assets/svg/SHF_Financial_Logo.svg';

// import { ReactComponent as OnlineSurveyIcon } from '../../assets/svg/online_survey.svg';
// import { ReactComponent as CalendarIcon } from '../../assets/svg/calendar_icon.svg';
// import { ReactComponent as TotalRBIcon } from '../../assets/svg/total_RB.svg';
// import { ReactComponent as PopulationIcon } from '../../assets/svg/population.svg';
// import { ReactComponent as FolridaMapIcon } from '../../assets/svg/florida_map.svg';
import { ReactComponent as BrazilFlog } from '../../assets/svg/brazilFlag.svg';
import { ReactComponent as ChinaIconFlag } from '../../assets/svg/chinaFlag.svg';
import { ReactComponent as GermanyIconFlag } from '../../assets/svg/germanyFlag.svg';
import { ReactComponent as JapanIconFlag } from '../../assets/svg/japanFlag.svg';
import { ReactComponent as UkFlag } from '../../assets/svg/ukFlag.svg';
import { ReactComponent as UsFlag } from '../../assets/svg/usFlag.svg';

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
        {/* <div className="objectives--container container--right">
          <SHFFinancial className="objectives--container container--right-svg" />
        </div> */}
        <div className="clearAll"></div>


      </div>
      <div className="nation-container">
       
       <div className="nation-container__card">
           <div className="nation-container__left">
              <BrazilFlog />
           </div>
           <div className="nation-container__right">
               <p>Sample Size</p>
               <b>165</b>
       </div>
       </div>
       <div className="nation-container__card">
           <div className="nation-container__left">
             <ChinaIconFlag />                 
           </div>
           <div className="nation-container__right">
               <p>Sample Size</p>
               <b>555</b>
       </div>
       </div>
       <div className="nation-container__card">
           <div className="nation-container__left">
               <GermanyIconFlag />
                 
           </div>
           <div className="nation-container__right">
               <p>Sample Size</p>
               <b>264</b>
       </div>
       </div>
       <div className="nation-container__card">
           <div className="nation-container__left">
              <JapanIconFlag />
                 
           </div>
           <div className="nation-container__right">
               <p>Sample Size</p>
               <b>213</b>
       </div>
       </div>
       <div className="nation-container__card">
           <div className="nation-container__left">
              <UsFlag />
           </div>
           <div className="nation-container__right">
               <p>Sample Size</p>
               <b>932</b>
       </div>
       </div>
       <div className="nation-container__card">
           <div className="nation-container__left">
            <UkFlag />
           </div>
           <div className="nation-container__right">
               <p>Sample Size</p>
               <b>259</b>
       </div>
       </div>
      
     </div>
    </div>
  );
};

export default Objectives;
