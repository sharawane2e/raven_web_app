import { Grid } from "@material-ui/core";
import AppRouting from "../../AppRouting";
import BrandLogo from "../../components/BrandLogo";
import CopyrightFooter from "../../components/CopyrightFooter";

import PublicBanner from "../../components/PublicBanner";
import IRoute from "../../types/IRoute";

export interface PublicFormScreenProps {
  routes: IRoute[];
}

const PublicFormScreen: React.FC<PublicFormScreenProps> = (props) => {
  return (
    <div className="public-form-screen">
      <Grid container>
        <Grid item md={6} sm={6} className="public-form-screen__form-area">
          <BrandLogo className="public-form-screen__brand-logo" />
          <AppRouting routes={props.routes} />
         <CopyrightFooter />
        </Grid>
        <Grid item md={6} sm={6} className="public-banner__banner-area">
          <PublicBanner />
        </Grid>
      </Grid>
    </div>
  );
};

export default PublicFormScreen;
