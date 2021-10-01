import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import ApolloProvider from './graphql/ApolloProvider/ApolloProvider';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './context/auth';
import { MessageProvider } from './context/message';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import DynamicRoute from './util/DynamicRoute';


const App: React.FC = () => 
{
  return (

    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <Router>
            <Container className="p-5">
              <Switch>
                <DynamicRoute exact path="/" component={Chat} authenticated/>
                <DynamicRoute path="/register" component={Register} guest/>
                <DynamicRoute path="/login" component={Login} guest/>
              </Switch>
            </Container>
          </Router>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}


export default App;
