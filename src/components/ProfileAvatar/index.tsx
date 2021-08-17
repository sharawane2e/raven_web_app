export interface ProfileAvatarProps {
  text: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = (props) => {
  const { text } = props;

  return (
    <div className="profile-avatar">
      <span>{text}</span>
    </div>
  );
};

export default ProfileAvatar;
