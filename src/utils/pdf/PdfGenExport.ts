import { ChartLabelType } from '../../enums/ChartLabelType';

export const PdfGenExport = (seriesData: any, chartlabelType: string) => {
  const options = {
    fillColor: 'ffffff',
    bold: false,
  };

  const tablePptOutput: any[] = [];

  seriesData.forEach((tableRowArr: any) => {
    const rowArr: any[] = [];

    tableRowArr.forEach((cellObject: any) => {
      console.log('chartlabelType', chartlabelType);
      const laleType = chartlabelType === ChartLabelType.PERCENTAGE ? '%' : '';
      const cellObj = {
        content: cellObject.text + laleType,
        styles: {
          ...options,
          fillColor:
            cellObject.minMax == 'min'
              ? 'fbd9d4'
              : cellObject.minMax == 'max'
              ? 'b8e08c'
              : 'ffffff',
          bold:
            cellObject.minMax == 'min'
              ? true
              : cellObject.minMax == 'max'
              ? true
              : false,
        },
      };

      rowArr.push(cellObj);
    });

    tablePptOutput.push(rowArr);
  });

  return tablePptOutput;
};
