import MenuIcon from "@material-ui/icons/Menu";
import BrandLogo from "../BrandLogo";
import ProfileAvatar from "../ProfileAvatar";

export interface AppbarProps {}

const Appbar: React.FC<AppbarProps> = (props) => {
  return (
    <div className="appbar">
      <div className="appbar__left-panel">
        <BrandLogo />
        <MenuIcon className="appbar__menu" />
        <div className="appbar__heading">HFS OneOffice Pulse</div>
      </div>
      <div>
        <ProfileAvatar text="AB" />
      </div>
    </div>
  );
};

export default Appbar;
