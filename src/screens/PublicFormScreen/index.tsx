import { Grid } from "@material-ui/core";
import AppRouting from "../../AppRouting";
import PublicBanner from "../../components/PublicBanner";
import IRoute from "../../types/IRoute";

export interface PublicFormScreenProps {
  routes: IRoute[];
}

const PublicFormScreen: React.FC<PublicFormScreenProps> = (props) => {
  return (
    <div className="public-form-screen">
      <Grid container>
        <Grid item md={6} sm={6}>
          <AppRouting routes={props.routes} />
        </Grid>
        <Grid item md={6} sm={6}>
          <PublicBanner />
        </Grid>
      </Grid>
    </div>
  );
};

export default PublicFormScreen;
