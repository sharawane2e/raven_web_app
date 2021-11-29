import { ReactComponent as BrandLogoIcon } from "../../assets/svg/brand-logo.svg";
//import { ReactComponent as BrandLogoIcon } from "../../assets/svg/primary-brand-logo.svg";

export interface BrandLogoProps extends React.SVGAttributes<any> {}

const BrandLogo: React.FC<BrandLogoProps> = (props) => {
  return <BrandLogoIcon {...props} />;
};

export default BrandLogo;
