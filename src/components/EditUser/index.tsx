import { useState } from 'react';
import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import ApiUrl from '../../enums/ApiUrl';
import { UserDetailsContext } from '../../contexts/UserDetailsContext';
import withLoader, { WithLoaderProps } from '../../hoc/withLoader';
import ApiRequest from '../../utils/ApiRequest';
import Toaster from '../../utils/Toaster';
import Userform from '../Userform';
import Breadcrum from '../widgets/Breadcrum';

export interface EditUserProps extends WithLoaderProps {}

const EditUser: React.FC<EditUserProps> = (props) => {
  const [user, setUser] = useState<any>(null);
  const { selectedUserId } = useContext(UserDetailsContext);
  const history = useHistory();

  useEffect(() => {
    if (selectedUserId) {
      fetchUserDetails(selectedUserId);
    } else {
      history.push('/admin');
    }
  }, [selectedUserId]);

  const fetchUserDetails = (id: string) => {
    const url = `${ApiUrl.USER}/${id}`;

    props.startLoading('Fetching user data', true);
    ApiRequest.request(url, 'GET')
      .then((res) => {
        if (res.success) {
          setUser(res.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => props.stopLoading());
  };

  const onSubmit = (data: any) => {
    props.stopLoading();

    const editUrl = `${ApiUrl.USER}/${user?._id}`;

    // const userFromLocalDB = LocalStorageUtils.getUser();
    // if(userFromLocalDB && userFromLocalDB._id===selectedUserId){

    // }

    ApiRequest.request(editUrl, 'PATCH', data)
      .then((res) => {
        if (res.success) {
          Toaster.success(res.message);
          history.push('/admin/user-details');
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        props.stopLoading();
      });
  };

  return (
    <div className="add-user">
      <div className="contant-shape">
        <Breadcrum pageTitle="Admin" />
      </div>
      <div className="admin-panel__page-title">Edit user</div>
      <Userform onSubmit={onSubmit} user={user} submitText="Edit user" />
    </div>
  );
};

export default withLoader(EditUser);
