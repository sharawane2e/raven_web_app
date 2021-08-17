import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars";

const CustomScrollbar: React.FC<ScrollbarProps> = (props) => {
  const { children } = props;
  delete props.children;

  return (
    <Scrollbars {...props}>
      <div className="custom-scrollbar__wrapper">{children}</div>
    </Scrollbars>
  );
};

export default CustomScrollbar;
