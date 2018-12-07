import React from 'react';
import Input from '../mixins/Input';
import Button from '../mixins/Button';

export default class LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        };
    }

    onChange = (key) => (value) => {
        this.setState(
            {
                [key]: value,
            },
            () => {
                console.log(this.state);
            }
        );
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const user = { password: this.state.password, email: this.state.email };
        this.props.login(user);
    };

    render() {
        const buttonLabel = (
            <span>
                <span>Login</span>
                <i className="fa fa-arrow-right" />
            </span>
        );
        return (
            <form>
                <Input
                    placeholder="Enter your E-mail..."
                    label="Email"
                    Id="emailLogin"
                    type="email"
                    onChange={this.onChange('email')}
                />
                <Input
                    placeholder="******"
                    label="Password"
                    Id="passwordLogin"
                    type="password"
                    onChange={this.onChange('password')}
                />
                <Button
                    label={buttonLabel}
                    onClick={this.handleSubmit}
                    additionalClassName="login"
                    buttonColor="btn-info"
                />
            </form>
        );
    }
}
