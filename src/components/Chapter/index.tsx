import _ from 'lodash';
import { useState, useContext, MouseEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StaticText } from '../../constants/StaticText';
import ApiUrl from '../../enums/ApiUrl';
import {
  setChapters,
  setSelectedChapterId,
} from '../../redux/actions/chapterActions';
import { setFilterQuestionList } from '../../redux/actions/filterActions';
import store, { RootState } from '../../redux/store';
// import { IChapter } from '../../types/IChapter';
import ApiRequest from '../../utils/ApiRequest';
import SingleSelect from '../widgets/SingleSelect';

interface ChapterProps {
  variant?: 'fullWidth' | 'partialWidth';
}

const Chapter: React.FC<ChapterProps> = (props) => {
  let updateQuestionList: any[] = [];
  const [openQSelection, setOpenQSelection] = useState(false);
  const {
    questions,
    chapters: { allChapters, selectedChapterId },
  } = useSelector((state: RootState) => state);
  const { filters } = store.getState();
  const dispatch = useDispatch();

  const fetchChaptersList = async () => {
    const res = await ApiRequest.request(ApiUrl.CHAPTERS, 'GET');
    // console.log(res);
    if (res.success) {
      dispatch(setChapters(res.data));
    }
  };

  const handleQSelectionOpen = () => {
    setOpenQSelection(true);
  };

  const handleQSelectionClose = () => {
    setOpenQSelection(false);
  };

  const sortedChapterOrder = _.sortBy(allChapters, ['order']);

  const handleChapterChange = (value: string) => {
    dispatch(setSelectedChapterId(value));
    //console.log('sortedChapterOrder', sortedChapterOrder);
    sortedChapterOrder.forEach((chapterData: any, index) => {
      console.log('chapterData', chapterData);
      if (chapterData['chapterId'] === value) {
        console.log('sortedChapterOrder', chapterData?.FiltersQIds);
        for (var i = 0; i < chapterData?.FiltersQIds.length; i++) {
          for (var j = 0; j < filters?.filterQuestionList.length; j++) {
            if (
              chapterData?.FiltersQIds[i] == filters?.filterQuestionList[j].qId
            )
              updateQuestionList.push(filters?.filterQuestionList[j]);
            // dispatch(setFilterQuestionList(updatedList));
          }
        }
      }
    });
    dispatch(setFilterQuestionList(updateQuestionList));
  };
  useEffect(() => {
    fetchChaptersList();
    dispatch(setSelectedChapterId('1'));
    // sortedChapterOrder.forEach((chapterData: any, index) => {
    //   if (chapterData['chapterId'] === '1') {
    //     //console.log('confition dat');
    //     console.log('sortedChapterOrder', chapterData?.FiltersQIds);
    //     for (var i = 0; i < chapterData?.FiltersQIds.length; i++) {
    //       console.log('http://localhost:3000/');
    //       for (var j = 0; j < filters?.filterQuestionList.length; j++) {
    //         if (
    //           chapterData?.FiltersQIds[i] == filters?.filterQuestionList[j].qId
    //         )
    //           //debugger;
    //           console.log(
    //             'filters?.filterQuestionList[j]',
    //             filters?.filterQuestionList[j],
    //           );

    //         updateQuestionList.push(filters?.filterQuestionList[j]);
    //         // dispatch(setFilterQuestionList(updatedList));
    //       }
    //     }
    //   }
    // });
    // console.log('daraahg arradd', updateQuestionList);
    // dispatch(setFilterQuestionList(updateQuestionList));
  }, []);

  return (
    <>
      <SingleSelect
        options={sortedChapterOrder}
        // options={[{ chapterId: '', labelText: '' }, ...allSortedChapterData]}
        value={selectedChapterId}
        onItemSelect={handleChapterChange}
        //placeholder={StaticText.QUESTION_LABEL}
        valueKey="chapterId"
        labelKey="labelText"
        className="single_select_area chapter-dropdown"
        // disabledPredicate={(value) => value === selectedBannerQuestionId}
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
