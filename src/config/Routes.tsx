import Login from "../components/public-forms/Login";
import PublicFormScreen from "../screens/PublicFormScreen";
import IRoute from "../types/IRoute";

const Routes:IRoute[] = [
    {
        path:["/login", "/forgot-password", "set-password"],
        component:PublicFormScreen,
        exact:true,
        routes:[
            {
              path:"/login",
              component:Login  
            }
        ]
    }
]
export default Routes;