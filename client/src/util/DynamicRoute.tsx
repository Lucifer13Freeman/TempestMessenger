import { useAuthState } from "../context/auth";
import { Route, Redirect, RouteProps } from 'react-router-dom';


interface IDynamicRouteProps extends RouteProps
{
    authenticated?: boolean | undefined,
    guest?: boolean | undefined,
    component: React.FC
}

const DynamicRoute: React.FC<IDynamicRouteProps> = (
    { 
        authenticated = undefined, 
        guest, 
        component,
        props
    }: any) => 
{
    const { user }: any = useAuthState();

    if (authenticated && !user) 
    {
        return (
            <Redirect to="/login"></Redirect>
        )
    }
    else if (guest && user)
    {
        return (
            <Redirect to="/"></Redirect>
        )
    }
    else 
    {
        return (
            <Route component={component} {...props}/>
        )
    }
}


export default DynamicRoute;
