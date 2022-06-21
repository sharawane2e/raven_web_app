import './Objectives.scss';
import { ReactComponent as ResearchObjective } from '../../assets/svg/research_objective.svg';
import { ReactComponent as BusinessObjective } from '../../assets/svg/business_objective.svg';
import { ReactComponent as Nationally } from '../../assets/svg/nationally.svg';
import { ReactComponent as BrazilFlog } from '../../assets/svg/brazilFlag.svg';
import { ReactComponent as ChinaIconFlag } from '../../assets/svg/chinaFlag.svg';
import { ReactComponent as GermanyIconFlag } from '../../assets/svg/germanyFlag.svg';
import { ReactComponent as JapanIconFlag } from '../../assets/svg/japanFlag.svg';
import { ReactComponent as UkFlag } from '../../assets/svg/ukFlag.svg';
import { ReactComponent as UsFlag } from '../../assets/svg/usFlag.svg';
import { ReactComponent as Other } from '../../assets/svg/Other.svg';

interface Props {}

const Objectives = (props: Props) => {
  return (
    <div className="combinedScreen">
      <div className="objectives">
        <div className="objectives--container container--left">
          <h2>Project Overview and Sample</h2>
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
      <div className='normal-container'>
      <p>Q2, Q27, D1, D2 and scale questions that contain 'Top 2 box' and 'Bottom 2 box' cannot be cross tabulated however you are able to utilize the filter function to analyse this data for different patient samples</p>
      <p>* Weight related comorbidities include NASH, T2D, Dyslipidemia or High cholesterol, Sleep Apnea or High blood pressure</p>
      </div>
      <div className="nation-container">
      
        <div className="nation-container__card">
          <div className="nation-container__left">
            <BrazilFlog />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>1250</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <ChinaIconFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>1000</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <GermanyIconFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>800</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <JapanIconFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>800</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <UsFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>1250</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <UkFlag />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>800</b>
          </div>
        </div>
        <div className="nation-container__card">
          <div className="nation-container__left">
            <Other />
          </div>
          <div className="nation-container__right">
            <p>Sample Size</p>
            <b>5900</b>
          </div>
        </div>
        <div className="clearAll"></div>
        <p className="TextEtalic">
          **The data included in this dashboard has been weighted to be
          representative of the national population
        </p>
      </div>
      <div className="topic-container">
        <div className="topic-container__headerCont">
          <div className="topic-container__heading">
            <h2>Topics covered in the research</h2>
          </div>
          <div className="topic-container__headerCont-logo">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAA9CAIAAABnZbFjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAMJ2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuOWNjYzRkZTkzLCAyMDIyLzAzLzE0LTE0OjA3OjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuNSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA1LTE3VDE5OjM0OjM3KzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNS0xN1QyMDo0MzoyNCswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNS0xN1QyMDo0MzoyNCswNTozMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplMzc4ZjA3My1lM2NiLTRhZWMtOWJiOS1hNDZlYTc1ODU4Y2YiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphY2EyZTk2ZS1jODRjLTI2NDEtODdkNS02NmYzYmFjNjVmNjAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMTA5QkIyNkM2RjIxMUVDOEM5OUEyRDk3NzM5NDZBNyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHRpZmY6SW1hZ2VXaWR0aD0iNTAxIiB0aWZmOkltYWdlTGVuZ3RoPSIxNTIiIHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj0iMiIgdGlmZjpTYW1wbGVzUGVyUGl4ZWw9IjMiIHRpZmY6WFJlc29sdXRpb249IjcyLzEiIHRpZmY6WVJlc29sdXRpb249IjcyLzEiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6RXhpZlZlcnNpb249IjAyMzEiIGV4aWY6Q29sb3JTcGFjZT0iNjU1MzUiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI1MDEiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxNTIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDJkNzg1ZC05M2FlLTRkNDEtYmFjMy0xZGY5NGIwZDNmYTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjQ5YTc2MjEtMGIzMy00ZTc3LTlhY2MtMjhhMGUyZjU2NzI3IiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MjEwOUJCMjZDNkYyMTFFQzhDOTlBMkQ5NzczOTQ2QTciLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODFmMjA2MDgtNzMxZi00NTcxLTkzNjItMDEzM2RjMzRiNzkyIiBzdEV2dDp3aGVuPSIyMDIyLTA1LTE3VDE5OjM5OjE1KzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjMuMyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL2pwZWcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvanBlZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NDlhNzYyMS0wYjMzLTRlNzctOWFjYy0yOGEwZTJmNTY3MjciIHN0RXZ0OndoZW49IjIwMjItMDUtMTdUMTk6Mzk6MTUrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy4zIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDJkNzg1ZC05M2FlLTRkNDEtYmFjMy0xZGY5NGIwZDNmYTAiIHN0RXZ0OndoZW49IjIwMjItMDUtMTdUMjA6NDM6MjQrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy4zIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRl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"
              alt=""
            />
          </div>
        </div>
        <div className="topic-container__topicsCont">
          <div className="topic-container__leftcont">
            <div className="topicCont">
              <h3>SAMPLE CHARACTERISTICS/ COMPOSITION</h3>
              <ul>
                <li>Sample characteristics e.g. BMI (S1, S2, S3, S4, S5, S6, S7, S8)</li>
                <li>Experience of life event (D11)</li>
                <li>Addiction (D12)</li>
              </ul>
            </div>

            <div className="topicCont">
              <h3>SECTION 1: DAY-TO-DAY ACTIVITIES, HABITS &amp; ATTITUDES</h3>
              <ul>
                <li>Hobbies and activities (Q1, Q2)</li>
                <li>Activity levels (Q3, Q4)</li>
                <li>Evaluation of own health (Q5, Q6, Q7)</li>
                <li>Own health perceptions and relationship with HCPs (Q8)</li>
                <li>Attitudes to food (Q9)</li>
              </ul>
            </div>

            <div className="topicCont">
              <h3>SECTION 2: PERSONAL WEIGHT HISTORY</h3>
              <ul>
                <li>Views of own weight (Q12, Q13, Q14)</li>
                <li>Weight loss attempts and weight history (Q15, Q15a, Q15a_a, Q15b)</li>
                <li>Emotions around their weight (Q23)</li>
              </ul>
            </div>

            <div className="topicCont">
              <h3>SECTION 3: WEIGHT LOSS - THOSE WITH WEIGHT ISSUES</h3>
              <ul>
                <li>Weight History (age at first weight loss attempt, heaviest weight) (Q15c, Q16)</li>
                <li>Evaluation of weight loss attempts (Q17, Q17a, Q17b, Q18, Q18a, Q18b)</li>
                <li>Weight loss tracking (Q19)</li>
                <li>Motivation for weight loss attempts (Q20)</li>
                <li>Impact of weight on activities and hobbies (Q21)</li>
                <li>Reasons for weight gain (Q22)</li>
              </ul>
            </div>
          </div>
          <div className="topic-container__rightcont">
            <div className="topicCont">
              <h3>SECTION 4: WEIGHT MANAGEMENT &amp; EXPERIENCES</h3>
              <ul>
                <li>Views of being overweight (Q24)</li>
                <li>Weight discussions with HCPs (Q25, Q26)</li>
                <li>Experience with weight management options (Q27)</li>
                <li>Reasons for not trying WL medication (if applicable) (Q28)</li>
                <li>Conditions and experience with medication (Q29)</li>
                <li>Experience with medication (Q30, Q31)</li>
              </ul>
            </div>

            <div className="topicCont">
              <h3>SECTION 5: DEVICE PREFERENCES &amp; APP USAGE</h3>
              <ul>
                <li>Device access (Q32)</li>
                <li>Digital apps - comfort, adoption of digital apps (Q33, Q34)</li>
                <li>Experience, satisfaction and interest in specific health monitoring apps (Q35, Q37)</li>
              </ul>
            </div>

            <div className="topicCont">
              <h3>SECTION 6: EATING HABITS &amp; DIET </h3>
              <ul>
                <li>Frequency of types of foods eaten and ways of eating (D1, D1a, D2)</li>
                <li>Specific diet eaten (D3)</li>
                <li>Eating habits (Q10, Q11)</li>
              </ul>
            </div>

            <div className="topicCont">
              <h3>SECTION 7: DEMOGRAPHICS</h3>
              <ul>
                <li>Household (D4, D5)</li>
                <li>Children and dependents (D6)</li>
                <li>Marital status (D7)</li>
                <li>Education level (D8)</li>
                <li>Working hours (D8a)</li>
                <li>Town/ city/ rural location (D9)</li>
                <li>Insurance coverage (D10)</li>
                <li>Environment / sustainability (D10a)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Objectives;
