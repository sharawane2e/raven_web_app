export interface IChapter {
    _id: string;
    active: boolean;
    chapterId: string;
    chapterName: string;
    order: string;
    BannersQIds:string[];
    FiltersQIds:string[];
    QuestionsQIds:string[];
  }
  