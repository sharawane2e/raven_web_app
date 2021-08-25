import { MouseEvent, MouseEventHandler } from "react";

export interface ProfileAvatarProps {
  text: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = (props) => {
  const { text, onClick } = props;

  return (
    <div className="profile-avatar" onClick={onClick}>
      <span>{text}</span>
    </div>
  );
};

export default ProfileAvatar;
