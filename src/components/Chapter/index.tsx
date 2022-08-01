import _ from 'lodash';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiUrl from '../../enums/ApiUrl';
import {
  setChapters,
  setSelectedChapterId,
} from '../../redux/actions/chapterActions';
import { setSelectedQuestionId } from '../../redux/actions/questionAction';
import { RootState } from '../../redux/store';
import ApiRequest from '../../utils/ApiRequest';
import SelectUnstyled, {
  SelectUnstyledProps,
  selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, {
  optionUnstyledClasses,
} from '@mui/base/OptionUnstyled';
import { styled } from '@mui/system';
import {
  resetChart,
  setChartLabel,
  setChartType,
} from '../../redux/actions/chartActions';
import { getChartOptions } from '../../utils/ChartOptionFormatter';
import Toaster from '../../utils/Toaster';
import { ChartType } from '../../enums/ChartType';
import { StaticText } from '../../constants/StaticText';
import { ChartLabelType } from '../../enums/ChartLabelType';

interface ChapterProps {
  variant?: 'fullWidth' | 'partialWidth';
}

const Chapter: React.FC<ChapterProps> = (props) => {
  const [dropwDwonvalue, setDropdwonValue] = useState<any>('1');
  const {
    questions,
    chapters: { allChapters, selectedChapterId },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const sortedChapterOrder = _.sortBy(allChapters, ['order']);

  useEffect(() => {
    fetchChaptersList();
  }, []);

  useEffect(() => {
    handleChapterChange(selectedChapterId);
    const findIds: any = _.find(allChapters, {
      chapterId: selectedChapterId.toString(),
    });
    if (findIds)
      Toaster.success(`${StaticText?.CHART_APPLIED} ${findIds?.labelText}`);
  }, [selectedChapterId]);

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
    dispatch(setChartType(ChartType.COLUMN));
    dispatch(setChartLabel(ChartLabelType.PERCENTAGE));
    dispatch(resetChart(['']));
  };

  const StyledButton = styled('button')(
    () => `
  &.${selectUnstyledClasses.expanded} {
      &::after {
        content: '▴';
      }
    }
    &::after {
      content: '▾';
      position: absolute;
      right: 2px;
    }
    `,
  );

  const StyledOption = styled(OptionUnstyled)(
    () => `
    &.${optionUnstyledClasses.selected} {
      background-color: #f47c3c;
      color: #fff;
    }
    `,
  );

  function CustomSelect(props: SelectUnstyledProps<number>) {
    const components: SelectUnstyledProps<number>['components'] = {
      Root: StyledButton,
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
        <div className="custom-dropdown-button">
          {sortedChapterOrder.map((chapter: any, index: number) => {
            return (
              <StyledOption key={index} value={chapter?.chapterId}>
                {chapter?.labelText}
              </StyledOption>
            );
          })}
        </div>
      </CustomSelect>
    </>
  );
};

export default Chapter;
