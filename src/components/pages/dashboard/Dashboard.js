import React, { Component } from 'react';
import { Auth, API } from "aws-amplify";
import { List, Typography, Skeleton } from 'antd';
import './Dashboard.css';
// import Feeds from '../feeds/Feeds';
// import Resources from '../resources/Resources';
import game from "./game.jpg";
import music from "./music.jpg";
import book from "./book.jpg";



const { Title,Text } = Typography;
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
    };

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
    });

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

  
  // CountFeed()
  // {
  //   let e=0;
  //   this.state.posts.forEach(post => {
  //
  //     if(post.user===this.state.user)
  //     {
  //       e++;
  //     }
  //   });
  //
  //   return (<Text >Feeds: {e} , Resources: {e}, StudyGroup:{e}</Text>)
  // }


  countPosts(){
    let posts = this.state.posts;
    let user = this.state.userAttributes.preferred_username;
    let e = 0;

    posts.forEach(post => {
      if(post.user === user){
        e++;
      }
    });

    return e;
  }

  render() {
    const data =this.state.posts;
    let userAttributes = this.state.userAttributes;

    if(userAttributes === undefined)
      return (<Skeleton />);
    else
      return (
        <div>
        <div className="grid-head">
          <div>
            <Title level={3}>Hello <strong>{userAttributes.name}</strong>, hope you have an amazing day!</Title>
            <Title level={4}>Feeds: {this.countPosts()}</Title>
            <Text level={0}><p>1. CSCI Midterm on 4/17</p></Text>
            <Text level={0}><p>2. Appointment on 5/2</p></Text>
            <Text level={0}><p>3. MileStone2 on 4/9</p></Text>
          </div>
        </div>
        <div className="grid-container">
          <div>
            <div className="title"><Title style={{color:"white"}}>Feeds</Title></div>
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    description={<Text><Text style={{fontWeight: "bold"}}>{item.user.split('@')[0]}</Text> posted '{item.title}'in the <Text style={{textDecorationLine:"underline"}}>{item.subfeed}</Text> subfeed</Text>}
                  />
                </List.Item>
      )}
    />,
          </div>
          <div>
          <div className="title"><Title style={{color:"white"}}>Resources</Title></div>
          <p>{<img alt="example" src={music} height="30" />}<strong>{this.state.user.split('@')[0]}</strong> upload a video in the Computer Scinece</p>
          <p>{<img alt="example" src={book} height="24" />}<strong>{this.state.user.split('@')[0]}</strong> upload a document in the Chemistry</p>
          <p>{<img alt="example" src={book} height="24" />}<strong>{this.state.user.split('@')[0]}</strong> upload a text in the CSCI 113</p>
          <p>{<img alt="example" src={music} height="30" />}<strong>{this.state.user.split('@')[0]}</strong> upload a picture in the CSCI 152</p>
          <p>{<img alt="example" src={game} height="30" />}<strong>{this.state.user.split('@')[0]}</strong> upload a game in the CSCI 152</p>
          <p>{<img alt="example" src={music} height="30" />}<strong>{this.state.user.split('@')[0]}</strong> upload a picture in the CSCI 115</p>
          </div>
          <div>
          <div className="title"><Title style={{color:"white"}}>StudyGroup</Title></div>
          <p><strong>{this.state.user.split('@')[0]}</strong> joined "I want survive" in <span className="overline">CSCI119</span></p>
          <p><strong>{this.state.user.split('@')[0]}</strong> joined "Milestone2" in <span className="overline">CSCI152</span></p>
          <p><strong>{this.state.user.split('@')[0]}</strong> joined "Proofs introduction" in <span className="overline">CSCI119</span></p>
          <p><strong>{this.state.user.split('@')[0]}</strong> joined "Final" in <span className="overline">CSCI119</span></p>
          <p><strong>{this.state.user.split('@')[0]}</strong> joined "HW1" in <span className="overline">CSCI152</span></p>
          <p><strong>{this.state.user.split('@')[0]}</strong> joined "Project" in <span className="overline">CSCI115</span></p>

          </div>
        </div>
      </div>

      )
  }
}

export default Dashboard
