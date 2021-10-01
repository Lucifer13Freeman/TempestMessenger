import { useQuery } from '@apollo/client';
import { Col, Image } from 'react-bootstrap';
import { useMessageDispatch, useMessageState } from '../../../context/message';
import classNames from 'classnames';
import { SET_SELECTED_USER, SET_USERS } from '../../../constants/actions';
import { GET_USERS } from '../../../graphql/queries';
import { DEFAULT_AVATAR } from '../../../constants/links';


const Users: React.FC = () => 
{
  const dispatch = useMessageDispatch(undefined);
  const { users } = useMessageState();
  const selected_user = users?.find((u: any) => u.selected === true)?.id;

  const { loading } = useQuery(GET_USERS, 
  {
    onCompleted: data => dispatch({ type: SET_USERS, payload: data.get_users }),
    onError: err => console.log(err)
  });

  let users_markup;
  
  if (!users || loading)
  {
    users_markup = <p>Loading...</p>
  }
  else if (users.length === 0)
  {
    users_markup = <p>No users have joined yet</p>
  }
  else if (users.length > 0)
  {
    users_markup = users.map((user: any) => 
    {
      const selected = selected_user === user.id;

      const max_length: number = 16;

      let latest_message = user.latest_message?.content;

      latest_message = latest_message?.length > max_length 
                      ? `${latest_message.slice(0, max_length)}...`
                      : latest_message;

      return (
      
        <div 
          role="button"
          className={classNames(
              "user-div rounded d-flex justify-content-md-center-start p-3", 
                      { 'bg-white': selected }
                    )} 
          key={user.id} 
          onClick={() => dispatch({ type: SET_SELECTED_USER, payload: user.id })}
        >
          <Image 
            src={user.image || DEFAULT_AVATAR} 
            className="user-image"
          />
          <div className="d-none d-md-block mx-2">
            <p className="text-success">{`${user.surname} ${user.name}`}</p>
            <p className="font-weight-light">
              {user.latest_message 
                ? latest_message
                : 'You are now connected!'}
            </p>
          </div>
        </div>
      );
    });
  }

  return (
    <Col xs={2} md={4} className="p-0 bg-secondary rounded">
      {users_markup}
    </Col>
  );
}


export default Users;
