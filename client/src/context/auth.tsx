import jwtDecode from "jwt-decode";
import { createContext, useReducer, useContext } from "react"; 
import { LOGIN, LOGOUT } from "../constants/actions";


type Action = any;
type Dispatch = (action: Action) => void;
type State = { user: any };

let user: any = null;

const AuthStateContext = createContext<State | undefined>(undefined);
const AuthDispatchContext = createContext<Dispatch | undefined>(undefined, );

const token = localStorage.getItem('token')

if (token) 
{
  const decoded_token: any = jwtDecode(token);
  const expires_at = new Date(decoded_token.exp * 1000);

  if (new Date() > expires_at) localStorage.removeItem('token');
  else user = decoded_token;
  
} else console.log('No token found');


const auth_reducer = (state: any, action: any) =>
{
    switch(action.type)
    {
        case LOGIN:

            localStorage.setItem('token', action.payload.token);

            return {
                ...state,
                user: action.payload
            }

        case LOGOUT:

            localStorage.removeItem('token');

            return {
                ...state,
                user: null
            }
            
        default:
            throw new Error(`Unknown action type ${action.type}`);
    }
}


export const AuthProvider = ({ children }: any) =>
{
    const [state, dispatch] = useReducer(auth_reducer, { user });

    return (
        <AuthDispatchContext.Provider value={dispatch}>
            <AuthStateContext.Provider value={state}>
                {children}
            </AuthStateContext.Provider>
        </AuthDispatchContext.Provider>
    )
}


export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = (dispatch: Dispatch | undefined) => useContext(AuthDispatchContext);