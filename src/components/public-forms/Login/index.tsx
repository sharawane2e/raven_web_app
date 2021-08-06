import { Button, TextField } from "@material-ui/core";

export interface LoginProps {}

const Login: React.FC<LoginProps> = (props) => {
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="login public-form">
      <form className="public-form__form">
        <div className="public-form__heading">Login</div>

        <TextField variant="outlined" label="Email" />
        <TextField variant="outlined" label="Password" type="password" />

        <Button type="submit" onClick={handleSubmit}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
