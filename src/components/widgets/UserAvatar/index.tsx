import { Tooltip } from "@material-ui/core";
import clsx from "clsx";
import ProfileAvatar from "../ProfileAvatar";

export interface UserAvatarProps {
  pending: boolean;
  active: boolean;
  name: string;
}

const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const { name, pending, active } = props;

  return (
    <ProfileAvatar
      text={name}
      hasBadge
      className="user-avatar"
      bagdeComponent={
        <Tooltip
          title={
            pending
              ? "Activation pending"
              : active
              ? "User active"
              : "User inactive"
          }
          placement="top"
        >
          <span
            className={clsx("profile-avatar__badge", {
              pending: pending,
              active: active,
              "in-active": !active,
            })}
          ></span>
        </Tooltip>
      }
    />
  );
};

export default UserAvatar;
