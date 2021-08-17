import { Link } from "react-router-dom";

const StaticHomeScreen: React.FC = () => {
  return (
    <div>
      <h2>This is home screen</h2>
      <Link to="/admin">Go to admin panel</Link>
    </div>
  );
};

export default StaticHomeScreen;
