import { Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoginSchema from '../../../validation-schema/LoginSchema';
import InputField from '../../widgets/InputFields';
import { Link, useHistory } from 'react-router-dom';
import withLoader, { WithLoaderProps } from '../../../hoc/withLoader';
import ApiRequest from '../../../utils/ApiRequest';
import ApiUrl from '../../../enums/ApiUrl';
import Toaster from '../../../utils/Toaster';
import { promptMessages } from '../../../constants/messages';
import WebUrl from '../../../enums/WebUrl';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../../../redux/actions/userActions';
import LocalStorageUtils from '../../../utils/LocalStorageUtils';
import nielsenBase from '../../../assets/svg/nielsenBase.svg';
import ClientsLogo from '../../ClientsLogo';

export interface LoginProps extends WithLoaderProps {}

const Login: React.FC<LoginProps> = (props) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    mode: 'onBlur',
  });

  const dispatch: AppDispatch = useDispatch();

  const history = useHistory();

  const onSubmit = (data: any) => {
    props.startLoading(promptMessages.LOGGING_IN);

    ApiRequest.request(ApiUrl.LOGIN, 'POST', data)
      .then((res) => {
        if (res.success) {
          dispatch(setUserProfile(res.data));
          Toaster.success(res.message);
          ApiRequest.setAuthToken(res.data?.accessToken);
          LocalStorageUtils.setAccessToken(res.data.accessToken);
          history.push(WebUrl.HOME);
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => props.stopLoading());
  };

  const handleChange = (event: any, field: string) => {
    clearErrors(field);
    setValue(field, event.target.value);
  };

  return (
    <div className="login public-form">
      <form className="public-form__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="public-form__client-logo">{ <ClientsLogo /> }</div>
        <div className="public-form__heading">Login</div>
        <InputField
          {...register('email')}
          id="email"
          required
          label="Email"
          error={!!errors.email}
          helperText={errors?.email?.message}
          onChange={(e) => handleChange(e, 'email')}
        />
        <InputField
          {...register('password')}
          id="password"
          label="Password"
          required
          error={!!errors.password}
          helperText={errors?.password?.message}
          type="password"
          onChange={(e) => handleChange(e, 'password')}
        />

        <Button type="submit" className="button--primary btn-login-color">
          Login
        </Button>
        <Link className="public-form__link" to={WebUrl.FORGOT_PASSWORD}>
          Lost your password?
        </Link>
      </form>
    </div>
  );
};

export default withLoader(Login);
