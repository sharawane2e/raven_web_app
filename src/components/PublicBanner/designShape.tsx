import { ReactComponent as Designshape } from "../../assets/svg/topshape.svg";

export interface designshapeProps extends React.SVGAttributes<any> {}

const designTop: React.FC<designshapeProps> = (props) => {
  return <Designshape {...props} />;
};

export default designTop;