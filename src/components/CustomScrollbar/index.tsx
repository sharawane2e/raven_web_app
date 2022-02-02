import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars";

const CustomScrollbar: React.FC<ScrollbarProps> = (props) => {
  const { children } = props;
  const props_ = { ...props };

  delete props_.children;

  return (
    <Scrollbars {...props_} 
    renderThumbHorizontal={({style, ...props}) =><div {...props} className={'horizontal-scroll-thumb'} style={{...style, height:'5px'}} />}
    renderThumbVertical={({style, ...props}) =><div {...props} className={'vertical-scroll-thumb'} style={{...style, width:'5px'}} />}
    >
      <div className="custom-scrollbar__wrapper">{children}</div>
    </Scrollbars>

  );
};

export default CustomScrollbar;
