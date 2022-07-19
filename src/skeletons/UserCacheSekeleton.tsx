import { Skeleton } from '@material-ui/lab';

export interface UserCcheSekeletonProps {}

const UserCcheSekeleton: React.FC<UserCcheSekeletonProps> = (props) => {
  return (
    <>
      <div className="user-cache__sidebar">
        <div className="user-cache__cache-data">
          <div className={`user-cache__cache-data--cache-section`}>
            <div className="user-cache__chart-icon-sec">
              <Skeleton variant="circle" width={40} height={40} />
            </div>
            <div className="user-cache__chart-question">
              <div className="user-cache__chart-headding">
                <Skeleton variant="text" height={15} width={430} />
              </div>
              <div className="user-cache__collectdata">
                <div className="user-cache__date">
                  <Skeleton variant="text" height={15} width={20} />
                </div>
                <div className="user-cache__date">
                  <Skeleton variant="text" height={15} width={20} />
                </div>
                <div className="user-cache__date">
                  <Skeleton variant="text" height={15} width={20} />
                </div>
                <div className="user-cache__date">
                  <Skeleton variant="text" height={15} width={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="multi-select-btn">
            <Skeleton variant="text" height={15} width={20} />
          </div>
        </div>
        <div className="user-cache__bottom-line"></div>
      </div>
    </>
  );
};

export default UserCcheSekeleton;
