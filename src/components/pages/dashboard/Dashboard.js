import React, { Component } from 'react';
import { Auth, API } from "aws-amplify";
import { Avatar, message, Input, List, Skeleton, Popconfirm, Icon, Typography, Button } from 'antd';
import uuid from "uuid";
import './Dashboard.css';
import Feeds from '../feeds/Feeds';




const { Title } = Typography;
export class Dashboard extends Component {
  constructor(props){
    super(props);

    this.state = {
      confirmLoading: false,
      buttonLoading: false,
      current_subfeed: 'General',
      loading: true,
      user: '',
      posts: [],
      component: 1,
      title: '',
      content: '',
      visible: false
    }

    this.getPosts = this.getPosts.bind(this);
    
  }
  
  async componentDidMount(){
    this.props.handler("Dashboard");
    await Auth.currentAuthenticatedUser({
      bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(response => {
      console.log('Setting userAttributes to:', response.attributes);
      this.setState({userAttributes: response.attributes})
    }).catch(err => console.log(err));
    this.getPosts();
  }

  async getPosts() {
    this.setState({
      posts: [],
      loading: true
    })

    try {
      const posts = await API.get("posts", "/posts/get-posts");
      // this.setState({posts});
      posts.body.map((post) => (
        this.setState({
          posts: [
            ...this.state.posts,
            {
              subfeed: post.subfeed,
              timestamp: post.timestamp,
              id: post.id,
              user: post.user,
              title: post.title,
              content: post.content
            }
          ]
        })
      ));
      // console.log(posts.body);
      this.setState({loading: false});
    } catch (e) {
      console.log(e);
      this.setState({loading: false});
    }
  }
  
  render() {
    const data =this.state.posts;
    let userAttributes = this.state.userAttributes ? this.state.userAttributes : "";
    return (
      <div>
        <div className="grid-head">
          <div>Hello {userAttributes.name}</div>
        </div>
        <div className="grid-container">
          <div>
            <Feeds/>
          </div>
          <div>Resources</div>
          <div>StudyGroup</div>
        </div>
    </div>

    )
  }
}

export default Dashboard
