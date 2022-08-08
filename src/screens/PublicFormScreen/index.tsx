import { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import AppRouting from '../../AppRouting';
import BrandLogo from '../../components/BrandLogo';
import CopyrightFooter from '../../components/CopyrightFooter';
import PublicBanner from '../../components/PublicBanner';
import IRoute from '../../types/IRoute';
import LocalStorageUtils from '../../utils/LocalStorageUtils';
import { History, LocationState } from 'history';

export interface PublicFormScreenProps {
  routes: IRoute[];
  history: History<LocationState>;
}

const PublicFormScreen: React.FC<PublicFormScreenProps> = (props) => {
  useEffect(() => {
    if (LocalStorageUtils.getToken()) {
      props.history.push('/');
    }
  });
  return (
    <div className="public-form-screen">
      <Grid container>
        <Grid item md={4} sm={4} className="public-form-screen__form-area">
          <BrandLogo className="public-form-screen__brand-logo" />
          <AppRouting routes={props.routes} />
          <CopyrightFooter />
        </Grid>
        <Grid item md={8} sm={8} className="public-banner__banner-area">
          <PublicBanner />
        </Grid>
      </Grid>
    </div>
  );
};

export default PublicFormScreen;
