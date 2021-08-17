interface ITableColumn {
  /**
   * name of the property to be matched with in the row object
   */
  key: string;

  /**
   * header label of the column
   */
  label: string;

  /**
   * minimum css width to be given to column head
   */
  minWidth?: string;

  /**
   * specifies the alinment of the data in the column
   */
  align?: "left" | "right" | "center";

  /**
   * modifies the value in a specific format
   */
  format?: (value: any, row?: any) => any;

  /**
   * enambles sorting on the givn field
   */
  hasSorting?: boolean;
}

export default ITableColumn;
