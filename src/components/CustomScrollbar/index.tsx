import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars";

const CustomScrollbar: React.FC<ScrollbarProps> = (props) => {
  const { children } = props;
  const props_ = { ...props };

  delete props_.children;

  return (
    <Scrollbars {...props_}>
      <div className="custom-scrollbar__wrapper">{children}</div>
    </Scrollbars>
  );
};

export default CustomScrollbar;
