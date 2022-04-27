import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';

export interface BreadcrumProps {
  pageTitle: string;
}

const Breadcrum: React.FC<BreadcrumProps> = (props) => {
  const { pageTitle } = props;
  return (
    <div className="breadcrum">
      <Link to="/home">
        <HomeIcon />
      </Link>
      <span className="breadcrum__separator">/</span>
      {pageTitle}
    </div>
  );
};

export default Breadcrum;
