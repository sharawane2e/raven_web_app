import React, { ReactElement } from 'react';
import ButtonGroup, { ButtonGroupConfig } from '../widgets/ButtonGroup';
import { ReactComponent as NumberIcon } from '../../assets/svg/Number.svg';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

interface StandardDeviation {}

const StandardDeviation: React.FC<StandardDeviation> = () => {
  const {
    questions,
    standard: { isMean, standardDeviation, standardError },
  } = useSelector((state: RootState) => state);

  return (
    <div className="standard-deviation">
      <div className="standard-deviation__mean">
        <span>Mean</span>:<span className="show-value">10</span>
      </div>
      <div className="standard-deviation__standard-deviation">
        <span>Standard Deviation</span>:<span className="show-value">20</span>
      </div>
      <div className="standard-deviation__standard-error">
        <span>Standard Error</span>:<span className="show-value">30</span>
      </div>
    </div>
  );
};

export default StandardDeviation;
