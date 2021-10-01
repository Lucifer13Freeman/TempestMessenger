import { Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthDispatch, useAuthState } from '../../context/auth';
import { useMessageDispatch } from '../../context/message';
import Users from './Users/Users';
import Messages from './Messages/Messages';
import { useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { ADD_MESSAGE, ADD_REACTION, LOGOUT } from '../../constants/actions';
import { NEW_MESSAGE, NEW_REACTION } from '../../graphql/subsriptions';
import './Chat.scss';


const Chat: React.FC = () => 
{
  const auth_dispatch: any = useAuthDispatch(undefined);
  const message_dispatch = useMessageDispatch(undefined);

  const { user }: any = useAuthState();

  const { data: message_data, error: message_error } = useSubscription(NEW_MESSAGE);
  const { data: reaction_data, error: reaction_error } = useSubscription(NEW_REACTION);


  useEffect(() => 
  {
    if (message_error) console.log(message_error);

    if (message_data)
    {
      const message = message_data.new_message;
      const other_user = user.id === message.to ? message.from : message.to;

      message_dispatch({ type: ADD_MESSAGE, 
                          payload: {
                            id: other_user,
                            message
                        }});
    }
  }, [message_data, message_error]);


  useEffect(() => 
  {
    if (reaction_error) console.log(reaction_error);

    if (reaction_data)
    {
      const reaction = reaction_data.new_reaction;
      const other_user = user.id === reaction.message.to 
                          ? reaction.message.from 
                          : reaction.message.to;

      message_dispatch({ type: ADD_REACTION, 
                          payload: {
                            id: other_user,
                            reaction
                        }});
    }
  }, [reaction_data, reaction_error]);


  const logout = () =>
  {
    auth_dispatch({ type: LOGOUT });
    window.location.href = '/login';
  }

  const links = (
    <>
      <Link to="/login">
        <Button variant="link">Login</Button>
      </Link>
      <Link to="/register">
        <Button variant="link">Register</Button>
      </Link>
    </>
  );

  return (
    <>
      <Row className="bg-white justify-content-around rounded text-center mb-2">
        <Col>
          {!user && links}
          <Button variant="link" onClick={logout}>Logout</Button>
        </Col>
      </Row>
      <Row className="bg-white rounded">
        <Users/>
        <Messages/>
      </Row>
    </>
  )
}


export default Chat;