import { useState, useContext, MouseEvent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StaticText } from '../../constants/StaticText';
import store, { RootState } from '../../redux/store';
import SingleSelect from '../widgets/SingleSelect';

interface ChapterProps {
  variant?: 'fullWidth' | 'partialWidth';
}

const Chapter: React.FC<ChapterProps> = (props) => {
  const [openQSelection, setOpenQSelection] = useState(false);
  const {
    questions,
    chart: {
      chartLoading,
      questionData,
      baseCount,
      chartType,
      chartData,
      bannerQuestionData,
    },
    sidebar: { open },
  } = useSelector((state: RootState) => state);
  const { chart } = store.getState();
  //const dispatch: AppDispatch = useDispatch();
  const {
    questionList,
    selectedQuestionId,
    bannerQuestionList,
    selectedBannerQuestionId,
  } = questions;
  const handleQuestionChange = (value: string) => {
    console.log('chnaged show');
  };

  const handleQSelectionOpen = () => {
    setOpenQSelection(true);
  };

  const handleQSelectionClose = () => {
    setOpenQSelection(false);
  };
  return (
    <>
      <SingleSelect
        options={questionList}
        value={selectedQuestionId}
        onItemSelect={handleQuestionChange}
        //   placeholder={StaticText.QUESTION_LABEL}
        valueKey="qId"
        labelKey="labelText"
        className="single_select_area chapter-selection"
        disabledPredicate={(value) => value === selectedBannerQuestionId}
        MenuProps={{
          classes: { paper: 'testing' },
        }}
        open={openQSelection}
        handleClose={handleQSelectionClose}
        handleOpen={handleQSelectionOpen}
      />
    </>
  );
};

export default Chapter;
