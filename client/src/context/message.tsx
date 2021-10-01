import { createContext, useReducer, useContext } from "react"; 
import { SET_USERS, 
        SET_USER_MESSAGES, 
        SET_SELECTED_USER, 
        ADD_MESSAGE, 
        ADD_REACTION } from "../constants/actions";


const MessageStateContext = createContext<any>(undefined);
const MessageDispatchContext = createContext<any>(undefined, );


const message_reducer = (state: any, action: any) =>
{
    let users_copy, user_index, updated_user;

    const { id, message, messages, reaction } = action.payload;

    switch(action.type)
    {
        case SET_USERS:

            return {
                ...state,
                users: action.payload
            }
        
        case SET_USER_MESSAGES:

            users_copy = [...state.users];
            user_index = users_copy.findIndex((u: any) => u.id === id);

            users_copy[user_index] = { ...users_copy[user_index], messages };

            return {
                ...state,
                users: users_copy
            }

        case SET_SELECTED_USER:

            users_copy = state.users.map((user: any) => 
            ({
                ...user,
                selected: user.id === action.payload
            }));

            return {
                ...state,
                users: users_copy
            }

        
        case ADD_MESSAGE:

            users_copy = [...state.users];
            user_index = users_copy.findIndex((u: any) => u.id === id);

            message.reactions = [];

            updated_user = {
                ...users_copy[user_index],
                messages: users_copy[user_index].messages 
                            ? [message, ...users_copy[user_index].messages] 
                            : null,
                latest_message: message
            }

            users_copy[user_index] = updated_user;

            return {
                ...state,
                users: users_copy
            }


        case ADD_REACTION:

            users_copy = [...state.users];
            user_index = users_copy.findIndex((u: any) => u.id === id);

            updated_user = { ...users_copy[user_index] }

            const message_index: any = updated_user.messages?.findIndex(
                (m: any) => m.id === reaction.message.id
            );

            if (message_index > -1)
            {
                let messages_copy = [...updated_user.messages];
                let reactions_copy = [...messages_copy[message_index].reactions];

                const reaction_index = reactions_copy.findIndex(
                    (r: any) => r.id === reaction.id
                );

                if (reaction_index > -1) reactions_copy[reaction_index] = reaction;
                else reactions_copy = [...reactions_copy, reaction];
                
                messages_copy[message_index] = {
                    ...messages_copy[message_index],
                    reactions: reactions_copy
                }

                updated_user = { ...updated_user, messages: messages_copy }
                users_copy[user_index] = updated_user;
            }

            return {
                ...state,
                users: users_copy
            }


        default:
            throw new Error(`Unknown action type ${action.type}`);
    }
}


export const MessageProvider = ({ children }: any) =>
{
    const [state, dispatch] = useReducer<any>(message_reducer, { users: null });

    return (
        <MessageDispatchContext.Provider value={dispatch}>
            <MessageStateContext.Provider value={state}>
                {children}
            </MessageStateContext.Provider>
        </MessageDispatchContext.Provider>
    )
}


export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = (dispatch: any) => useContext(MessageDispatchContext);