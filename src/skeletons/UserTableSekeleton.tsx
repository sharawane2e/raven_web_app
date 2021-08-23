import { Skeleton } from "@material-ui/lab";

export interface UserTableSkeletonProps {}

const UserTableSkeleton: React.FC<UserTableSkeletonProps> = (props) => {
  return (
    <div className="rc__body-row">
      <div className="rc__body-cell">
        <Skeleton variant="text" height={15} width={50} />
      </div>
      <div className="rc__body-cell">
        <Skeleton variant="text" height={15} width={50} />
      </div>
      <div className="rc__body-cell">
        <Skeleton variant="text" height={15} width={50} />
      </div>
      <div className="rc__body-cell">
        <Skeleton variant="text" height={15} width={50} />
      </div>
      <div className="rc__body-cell">
        <Skeleton variant="text" height={15} width={50} />
      </div>
      <div className="rc__body-cell">
        <Skeleton variant="text" height={15} width={50} />
      </div>
    </div>
  );
};

export default UserTableSkeleton;
