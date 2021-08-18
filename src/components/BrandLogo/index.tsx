import { ReactComponent as BrandLogoIcon } from "../../assets/svg/brand-logo.svg";


export interface BrandLogoProps extends React.SVGAttributes<any> {}

const BrandLogo: React.FC<BrandLogoProps> = (props) => {
  return <div className="public-form-screen__form-area__brandlogo"><BrandLogoIcon {...props} /></div>;
};

export default BrandLogo;
