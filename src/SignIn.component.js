import React, { Component } from 'react';
import {message, Layout, Col, Row, Divider, Form, Icon, Input, Button, Checkbox} from 'antd';
import { Auth } from "aws-amplify";
import { Typography } from 'antd';
import SignUp from './SignUp';
import logo from './assets/logo.jpg';
import './App.css';

const { Title } = Typography;


const {
  Header, Footer, Sider, Content,
} = Layout;

const success = () => {
  message.loading('Action in progress..', 2.5)
    .then(() => message.success('Loading finished', 2.5));
  };

class SignInComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      formType: 0,
      email: "",
      password: ""
    }
  }

  handleChange = event => {
    console.log(`${event.target.id} is now: `, event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    console.log(this.state);

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if(!err){
        console.log(values);
        var email = values.email;
        var password = values.password;
        const response = await Auth.signIn(email, password)
          .then(data => {console.log(data); message.success("Success!", 2.5);})
          .catch(err => {console.log(err); message.error(err.message, 2.5)});
      } else {
        console.log(err);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    var changeForm  =   this.props.changeForm;
    return (
      <div>
      <Title level={3} style={{paddingLeft: 0}}>Sign in</Title>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item style={{paddingTop: 20}}>
          {getFieldDecorator('email', {
            rules: [{ type: 'email', message: 'The input is not valid E-mail!'},
                    { required: true, message: 'Please input your email!' }]
          })(
            <Input setFieldsValue={this.state.email} onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input setFieldsValue={this.state.password} onChange={this.handleChange} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" onClick={() => changeForm(1)}>Forgot password</a>
          <Button loading={this.state.loading} onClick={this.handleSubmit} type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a onClick={() => changeForm(2)}>register now!</a>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'sign_in' })(SignInComponent);

export default WrappedNormalLoginForm;
