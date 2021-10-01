export {};
const {  Message, User } = require('../../db/models');
const argon2 = require('argon2');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');


module.exports = {
    
    Query: 
    {
        get_users: async (_: any, __: any, { user }: any ) => 
        {
            try 
            {
                if (!user) throw new AuthenticationError('Unauthenticated');

                const all_users = await User.findAll(
                {
                    attributes: [
                        'id',
                        'surname',
                        'name',
                        'patronymic',
                        'image',
                        'created_at', 
                        'updated_at' 
                    ]
                });

                let users = all_users.filter((u: any) => u.id !== user.id);

                const all_user_messages: Array<any> = await Message.findAll(
                {
                    where: { 
                        [Op.or]: [
                            { from: user.id }, 
                            { to: user.id } 
                        ]
                    },
                    order: [[ 'created_at', 'DESC' ]]
                });

                users = users.map((other_user: any) => 
                {
                    const latest_message = all_user_messages.find(
                        (m: any) => m.from === other_user.id 
                                    || m.to === other_user.id
                    );

                    if (latest_message) other_user.latest_message = latest_message;

                    return other_user;
                });
                
                return users;
            } 
            catch (err) 
            {
                console.log(err);
                throw err;
            }
        },
        login: async (_: any, args: any) =>
        {
            const { email, password } = args;

            let errors: any = {
                email: undefined,
                password: undefined
            };

            try 
            {
                if (email.trim() === '') errors.email = 'Email must not be empty';
                if (password === '') errors.password = 'Password must not be empty';

                for (let value of Object.values(errors)) 
                    if (value !== undefined) 
                        throw new UserInputError('Bad input', { errors });

                const user = await User.findOne({ where: { email } });

                if (!user) 
                {
                    errors.email = 'User not found';
                    throw new UserInputError('User not found', { errors });
                }
                
                const is_match = await argon2.verify(user.password, password);

                if (!is_match)
                {
                    errors.password = 'Password is incorrect';
                    throw new UserInputError('Password is incorrect', { errors });
                }

                const payload = {

                    id: user.id,
                    surname: user.surname, 
                    name: user.name,
                    patronymic: user.patronymic,
                    email: user.email
                };

                const token = jwt.sign(payload, 
                                        process.env.JWT_SECRET,
                                        { expiresIn: 3600 });

                return {
                    ...user.toJSON(),
                    token
                }
            }
            catch (err) 
            {
                console.log(err);
                throw err;
            }
        }
    },
    Mutation:
    {
        register: async (_: any, args: any) =>
        {
            const { name,
                    surname,
                    patronymic,
                    email,
                    password,
                    confirm_password } = args;

            let errors: any = {
                name: undefined,
                surname: undefined,
                email: undefined,
                password: undefined,
                confirm_password: undefined
            };

            try 
            {
                if (name.trim() === '') errors.name = 'Name must not be empty';
                if (surname.trim() === '') errors.surname = 'Surname must not be empty';
                if (email.trim() === '') errors.email = 'Email must not be empty';
                if (password.trim() === '') errors.password = 'Password must not be empty';
                if (confirm_password.trim() === '') errors.confirm_password = 'Repeat password must not be empty';
                
                if (password !== confirm_password) errors.confirm_password = 'Passwords must match';

                for (let value of Object.values(errors)) 
                    if (value !== undefined) 
                        throw errors;
                
                const hash: string = await argon2.hash(password);

                const user = await User.create(
                {
                    name,
                    surname,
                    patronymic,
                    email,
                    password: hash
                });

                return user;
            } 
            catch (err: any) 
            {
                console.log(err);
                
                if (err.name === 'SequelizeUniqueConstraintError')
                    errors.email = 'User with this email is already exists';
                else if (err.name === 'SequelizeValidationError') 
                    err.errors.forEach(
                        (e: any) => (errors[e.path] = e.message)
                    );
                
                throw new UserInputError('Bad input', { errors });
            }
        }
    }
}