import { ReactComponent as BrandLogoIcon } from "../../assets/svg/brand-logo.svg";


export interface BrandLogoProps extends React.SVGAttributes<any> {}

const BrandLogo: React.FC<BrandLogoProps> = (props) => {
  return <div><BrandLogoIcon {...props} /></div>;
};

export default BrandLogo;
