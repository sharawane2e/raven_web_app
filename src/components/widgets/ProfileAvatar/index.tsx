import { MouseEvent, MouseEventHandler } from "react";

export interface ProfileAvatarProps {
  text: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = (props) => {
  const { text, onClick } = props;
  const textArr = text.split(" ");
  const textInitials = textArr.map((textItem) => textItem[0]).join("");
  return (
    <div className="profile-avatar" onClick={onClick}>
      <span>{textInitials}</span>
    </div>
  );
};

export default ProfileAvatar;
