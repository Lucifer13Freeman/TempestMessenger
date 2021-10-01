import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../../context/auth';
import { LOGIN } from '../../constants/actions';
import { LOGIN_USER } from '../../graphql/queries';


interface ILogin 
{
    email: string;
    password: string;
}

interface IError
{
    email: string | undefined;
    password: string | undefined;
}

const initial_state: ILogin = 
{
    email: '',
    password: ''
};

const initial_error: IError =
{
    email: undefined,
    password: undefined
}


const Login: React.FC = () =>
{
    const [values, set_values] = useState(initial_state);
    const [errors, set_errors] = useState(initial_error);

    const dispatch: any = useAuthDispatch(undefined);

    const [login_user, { loading }] = useLazyQuery(LOGIN_USER, 
    {
        onError: (err) => err.graphQLErrors[0].extensions && set_errors(err.graphQLErrors[0].extensions.errors),
        onCompleted: (data) =>
        {
            dispatch({ type: LOGIN, payload: data.login });
            window.location.href = '/';
        }
    });
      
    const submit_login_form = (e: React.FormEvent) =>
    {
        e.preventDefault();
        login_user({ variables: values });
    }

    return (
        
        <Row className="bg-white py-4 justify-content-center rounded">
            <Col sm={8} md={6} lg={4}>
                <h1 className="text-center">
                    Login
                </h1>
                <Form onSubmit={submit_login_form}>
                     <Form.Group>
                        <Form.Label className={`mt-3 ${errors.email && 'text-danger'}`}>
                            { errors.email ?? 'Email address' }
                        </Form.Label>
                        <Form.Control 
                            type="email"
                            className={ errors.email && 'is-invalid' }
                            value={values.email}
                            onChange={ e => { e.target.value.length < 255 && 
                                            set_values({ ...values, email: e.target.value })} }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={`mt-3 ${errors.password && 'text-danger'}`}>
                            { errors.password ?? 'Password' }
                        </Form.Label>
                        <Form.Control 
                            type="password"
                            className={ errors.password && 'is-invalid' }
                            value={values.password}
                            onChange={ e => { e.target.value.length < 255 && 
                                            set_values({ ...values, password: e.target.value })} }
                        />
                    </Form.Group>
                    <div className="mt-3">
                        <small>Don't have an account?  </small>
                        <Link to="/register">Register</Link>
                    </div>
                    <Button 
                        type="submit" 
                        variant="primary"
                        className="mt-3"
                        disabled={loading}
                    >
                        { loading ? 'loading...' : 'Login' }
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}


export default Login;
