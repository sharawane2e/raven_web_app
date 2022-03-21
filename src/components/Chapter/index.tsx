import { useState, useContext, MouseEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StaticText } from '../../constants/StaticText';
import ApiUrl from '../../enums/ApiUrl';
import { setChapters } from '../../redux/actions/chapterActions';
import store, { RootState } from '../../redux/store';
import { IChapter } from '../../types/IChapter';
import ApiRequest from '../../utils/ApiRequest';
import SingleSelect from '../widgets/SingleSelect';

interface ChapterProps {
  variant?: 'fullWidth' | 'partialWidth';
}



const Chapter: React.FC<ChapterProps> = (props) => {
  
  useEffect(()=>{
    fetchChaptersList();
  },[])

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
  const dispatch = useDispatch();
  const {
    questionList,
    selectedQuestionId,
    bannerQuestionList,
    selectedBannerQuestionId,
  } = questions;
  const handleQuestionChange = (value: string) => {
    console.log('chnaged show');
  };

  const fetchChaptersList = async () =>{
    const res = await ApiRequest.request(ApiUrl.CHAPTERS,"GET");
    console.log(res);
    if(res.success){

      dispatch(setChapters(res.data));
    }else{
      
    }
    
  }

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
        className="single_select_area Step-7"
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
