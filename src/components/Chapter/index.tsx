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
import {
  setQuestionList,
  setSelectedQuestionId,
} from '../../redux/actions/questionAction';
import store, { RootState } from '../../redux/store';
// import { IChapter } from '../../types/IChapter';
import ApiRequest from '../../utils/ApiRequest';
import SingleSelect from '../widgets/SingleSelect';
import SelectUnstyled, {
  SelectUnstyledProps,
  selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, {
  optionUnstyledClasses,
} from '@mui/base/OptionUnstyled';

import { styled } from '@mui/system';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { string } from 'yup';
import { fetchChartData } from '../../services/ChartService';
import { resetChart, setChartData } from '../../redux/actions/chartActions';
import { getChartOptions } from '../../utils/ChartOptionFormatter';
import { Series } from 'highcharts';

interface ChapterProps {
  variant?: 'fullWidth' | 'partialWidth';
}

const Chapter: React.FC<ChapterProps> = (props) => {
  // let updateQuestionList: any[] = [];
  // const [openQSelection, setOpenQSelection] = useState(false);
  const [dropwDwonvalue, setDropdwonValue] = useState<any>('1');
  const {
    questions,
    chapters: { allChapters, selectedChapterId },
  } = useSelector((state: RootState) => state);
  const { chart } = store.getState();
  const dispatch = useDispatch();

  const sortedChapterOrder = _.sortBy(allChapters, ['order']);

  useEffect(() => {
    fetchChaptersList();
  }, []);

  const fetchChaptersList = async () => {
    const res = await ApiRequest.request(ApiUrl.CHAPTERS, 'GET');
    if (res.success) {
      dispatch(setSelectedChapterId('1'));
      dispatch(setChapters(res.data));
    }
  };

  const handleChapterChange = (chapterId: any) => {
    dispatch(setSelectedChapterId(chapterId));
    setDropdwonValue(chapterId);
    getChartOptions();
    dispatch(setSelectedQuestionId(''));
    dispatch(resetChart(['']));
  };

  const StyledPopper = styled(PopperUnstyled)`
    z-index: 100;
  `;

  const StyledButton = styled('button')(
    () => `
  &.${selectUnstyledClasses.expanded} {
      &::after {
        content: '▴';
      }
    }
    &::after {
      content: '▾';
      float: right;
    }
    `,
  );

  const StyledOption = styled(OptionUnstyled)(
    () => `
    &.${optionUnstyledClasses.selected} {
      background-color: #000;
      color: #fff;
    }
    `,
  );

  function CustomSelect(props: SelectUnstyledProps<number>) {
    const components: SelectUnstyledProps<number>['components'] = {
      Root: StyledButton,
      Popper: StyledPopper,
      ...props.components,
    };

    return <SelectUnstyled {...props} components={components} />;
  }

  return (
    <>
      <CustomSelect
        value={dropwDwonvalue}
        onChange={handleChapterChange}
        className="custom-dropdown"
      >
        {sortedChapterOrder.map((chapter: any, index: number) => {
          return (
            <StyledOption key={index} value={chapter?.chapterId}>
              {chapter?.labelText}
            </StyledOption>
          );
        })}
      </CustomSelect>
    </>
  );
};

export default Chapter;
