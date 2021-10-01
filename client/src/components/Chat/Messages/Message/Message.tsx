import { useAuthState } from "../../../../context/auth";
import classNames from "classnames";
import { Button, Card, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import moment from 'moment';
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REACT_TO_MESSAGE } from "../../../../graphql/muatations";


const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

interface MessageProps
{
    message: any
}

const Message: React.FC<MessageProps> = ({ message }) => 
{
    const { user }: any = useAuthState();
    const sent = message.from === user.id;
    const recieved = !sent;

    const [show_popover, set_show_popover] = useState(false);

    const reaction_icons: Array<any> = [...new Set(message.reactions?.map((r: any) => r.content))];

    const [react_to_message] = useMutation(REACT_TO_MESSAGE, 
    {
        onError: err => console.log(err),
        onCompleted: () => set_show_popover(false)
    });

    const to_react = (reaction: string) =>
    {
        react_to_message({ variables: { id: message.id, content: reaction } });
    }

    
    const reaction_button = (

        <OverlayTrigger
            trigger="click"
            placement="top"
            show={show_popover}
            onToggle={set_show_popover}
            transition={false}
            rootClose
            overlay={
                <Popover 
                    id="popover-reactions"
                    className="rounded-pill"
                >
                    <Popover.Content className="d-flex p-1 align-items-center reaction-popover-button">
                        {reactions.map((reaction: string) => 
                        (
                            <Button 
                                variant="link" 
                                key={reaction}
                                className="reaction-icon-button"
                                onClick={() => to_react(reaction)}
                            >
                                {reaction}
                            </Button>
                        ))}
                    </Popover.Content>
                </Popover>
            }
        >
            <Button variant="link" className="px-3">
                <i className="far fa-smile"></i>
            </Button>
        </OverlayTrigger>
    );


    return (

        <Card className="border-0">
            <Card.Body className="py-3">
                <div className={classNames("d-flex", 
                                {
                                    'justify-content-end': sent,
                                    'justify-content-start': recieved
                                }
                            )}
                >
                    { sent && reaction_button }
                    <OverlayTrigger
                        placement={ sent ? 'left' : 'right' }
                        overlay={
                            <Tooltip id={message.id}>
                                { moment(message.created_at).format('DD MMMM YYYY @ h:mm a') }
                            </Tooltip>
                        }
                        transition={false}
                    >
                        <div className={classNames(
                                        "message-div py-2 px-2 bg-primary position-relative", 
                                        {
                                            'bg-primary': sent,
                                            'bg-secondary': recieved,
                                        }
                                    )}
                            style={{borderRadius: '16px'}}
                        >
                            <p className={classNames("px-2", { 'text-white': sent })}>
                                {message.content}
                            </p>
                            {message.reactions?.length > 0 && (
                                <div className="reactions-div bg-secondary p-1 rounded-pill">
                                    {reaction_icons} {message.reactions.length}
                                </div>
                            )}
                        </div>
                    </OverlayTrigger>
                    { recieved && reaction_button }
                </div>
            </Card.Body>
        </Card>
    );
}


export default Message;