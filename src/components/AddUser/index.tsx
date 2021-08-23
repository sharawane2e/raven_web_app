import { useHistory } from "react-router";
import ApiUrl from "../../config/ApiUrl";
import withLoader, { WithLoaderProps } from "../../hoc/withLoader";
import ApiRequest from "../../utils/ApiRequest";
import Toaster from "../../utils/Toaster";
import Userform from "../Userform";

export interface AddUserProps extends WithLoaderProps {}

const AddUser: React.FC<AddUserProps> = (props) => {
  const history = useHistory();

  const onSubmit = (data: any) => {
    props.startLoading();

    ApiRequest.request(ApiUrl.USER, "POST", data)
      .then((res) => {
        if (res.success) {
          Toaster.success(res.message);
          history.push("/admin/user-details");
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => props.stopLoading());
  };

  return (
    <div className="add-user">
      <div className="admin-panel__page-title">Add user</div>
      <Userform onSubmit={onSubmit} />
    </div>
  );
};

export default withLoader(AddUser);
