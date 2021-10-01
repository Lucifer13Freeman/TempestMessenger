import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';
import { REGISTER_USER } from '../../graphql/mutations';


interface IRegist 
{
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    password: string;
    confirm_password: string;
}

interface IError
{
    name: string | undefined;
    surname: string | undefined;
    patronymic: string | undefined;
    email: string | undefined;
    password: string | undefined;
    confirm_password: string | undefined;
}

const initial_state: IRegist = 
{
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    password: '',
    confirm_password: ''
};

const initial_error: IError =
{
    name: undefined,
    surname: undefined,
    patronymic: undefined,
    email: undefined,
    password: undefined,
    confirm_password: undefined
}


const Register: React.FC = () =>
{
    const history = useHistory();

    const [values, set_values] = useState(initial_state);
    const [errors, set_errors] = useState(initial_error);

    const [register_user, { loading }] = useMutation(REGISTER_USER, 
    {
        update: (_, __) => history.push('/login'),
        onError: (err) => err.graphQLErrors[0].extensions && set_errors(err.graphQLErrors[0].extensions.errors)
    });
      
    const submit_register_form = (e: React.FormEvent) =>
    {
        e.preventDefault();
        register_user({ variables: values });
    }

    return (

        <Row className="bg-white py-4 justify-content-center rounded">
            <Col sm={8} md={6} lg={4}>
                <h1 className="text-center">
                    Register
                </h1>
                <Form onSubmit={submit_register_form}>
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
                        <Form.Label className={`mt-3 ${errors.surname && 'text-danger'}`}>
                            { errors.surname ?? 'Surname' }
                        </Form.Label>
                        <Form.Control
                            type="text"
                            className={ errors.surname && 'is-invalid' }
                            value={values.surname}
                            onChange={ e => { e.target.value.length < 255 && 
                                            set_values({ ...values, surname: e.target.value })} }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={`mt-3 ${errors.name && 'text-danger'}`}>
                            { errors.name ?? 'Name' }
                        </Form.Label>
                        <Form.Control 
                            type="text"
                            className={ errors.name && 'is-invalid' }
                            value={values.name}
                            onChange={ e => { e.target.value.length < 255 && 
                                            set_values({ ...values, name: e.target.value })} }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className='mt-3'>
                            Patronymic
                        </Form.Label>
                        <Form.Control 
                            type="text"
                            value={values.patronymic}
                            onChange={ e => { e.target.value.length < 255 && 
                                            set_values({ ...values, patronymic: e.target.value })} }
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
                    <Form.Group>
                        <Form.Label className={`mt-3 ${errors.confirm_password && 'text-danger'}`}>
                            { errors.confirm_password ?? 'Confirm password'}
                        </Form.Label>
                        <Form.Control 
                            type="password"
                            className={ errors.confirm_password && 'is-invalid' }
                            value={values.confirm_password}
                            onChange={ e => { e.target.value.length < 255 && 
                                            set_values({ ...values, confirm_password: e.target.value })} }
                        />
                    </Form.Group>
                    <div className="mt-3">
                        <small>Alredy have an account?  </small>
                        <Link to="/login">Login</Link>
                    </div>
                    <Button 
                        type="submit" 
                        variant="primary"
                        className="mt-3"
                        disabled={loading}
                    >
                        { loading ? 'loading...' : 'Register' }
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}


export default Register;
