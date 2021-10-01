import React, { Fragment, useEffect, useState } from 'react';
import { useMessageDispatch, useMessageState } from '../../../context/message';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Col, Form } from 'react-bootstrap';
import Message from './Message/Message';
import { SET_USER_MESSAGES } from '../../../constants/actions';
import { GET_MESSAGES } from '../../../graphql/queries';
import { SEND_MESSAGE } from '../../../graphql/mutations';


const Messages: React.FC = () => 
{
  const dispatch = useMessageDispatch(undefined);
  const { users } = useMessageState();
  const [content, set_content] = useState('');

  const selected_user = users?.find((u: any) => u.selected === true);
  const messages = selected_user?.messages;

  const [get_messages, 
        { loading: messages_loading, 
          data: messages_data }] = useLazyQuery(GET_MESSAGES);

  const [send_message] = useMutation(SEND_MESSAGE, 
  {
    onError: err => console.log(err)
  });

  useEffect(() => 
  {
    if(selected_user && !selected_user.messages)
    {
      get_messages({ variables: { from: selected_user.id } })
    }
  }, [selected_user]);

  useEffect(() => 
  {
    if(messages_data)
    {
      dispatch({ type: SET_USER_MESSAGES, 
                payload: { 
                  id: selected_user.id, 
                  messages: messages_data.get_messages
      }})
    }
  }, [messages_data]);


  const submit_message = (e: React.FormEvent) =>
  {
    e.preventDefault();

    if (content.trim() === '' || !selected_user) return;

    send_message({ variables: { to: selected_user.id, content }});

    set_content('');
  }


  let selected_chat_markup;

  if(!messages && !messages_loading)
  {
    selected_chat_markup = <p className="info-text">Select a friend</p>
  }
  else if(messages_loading)
  {
    selected_chat_markup = <p className="info-text">Loading...</p>
  }
  else if (messages.length > 0)
  {
    selected_chat_markup = messages.map((message: any, index: any) => (
      <Fragment key={message.id}>
        <Message message={message}/>
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0"/>
          </div>
        )}
      </Fragment>
    ));
  }
  else if(messages.length === 0)
  {
    selected_chat_markup = <p className="info-text">You are connected now! Send you first message!</p>
  }
  
  return (
    <Col xs={10} md={8} className="p-0">
      <div className="messages-box d-flex flex-column-reverse p-3">
        {selected_chat_markup}
      </div>
      <div className="px-3 py-2">
        <Form onSubmit={submit_message}>
          <Form.Group className="d-flex align-items-center m-0">
            <Form.Control
              type="text"
              as="textarea" 
              rows={1}
              className="message-input rounded-pill p-3 className= bg-secondary border-0"
              placeholder="Type a message..."
              value={content}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        { e.target.value.length < 255 && 
                          set_content(e.target.value) }}
            />
            <i 
              className="fas fa-paper-plane fa-2x text-primary mx-2"
              onClick={submit_message}
              role="button"
            />
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
}


export default Messages;
