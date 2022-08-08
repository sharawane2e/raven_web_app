import { ReactComponent as ClientsLogoIcon } from '../../assets/svg/NielsenIQ-Logo.svg';

export interface ClientsLogoProps extends React.SVGAttributes<any> {}

const CleintsLogo: React.FC<ClientsLogoProps> = (props) => {
  return <ClientsLogoIcon {...props} />;
};

export default CleintsLogo;
