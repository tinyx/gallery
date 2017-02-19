import React, { Component } from 'react';
import { Spin, Layout, Menu, Breadcrumb, Icon, Slider } from 'antd';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router'

import Portfolio from './components/Portfolio';

import 'antd/dist/antd.css';
import './App.css';


const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class App extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline',
    openKeys: ['portfolio', 'illustration'],
    categories: null,
    images: null,
    imageSize: 300,
    theme: 'dark',
  };
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
      openKeys: collapsed ? [] : ['portfolio', 'illustration'],
    });
  }
  componentDidMount() {
    fetch('http://crabfactory.net/gallery/categories')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          categories: responseJson,
        });
      });
    fetch('http://crabfactory.net/gallery/images')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          images: responseJson,
        });
      });
  }
  onOpenChange = (openKeys) => {
    this.setState({
      openKeys
    });
  }
  onImageSizeChange = (imageSize) => {
    this.setState({
      imageSize
    });
  }
  formatter = (imageSize) => {
    switch(imageSize) {
      case 100: return 'Small';
      case 200: return 'Medium';
      case 300: return 'Large';
      case 400: return 'X Large';
    }
  }
  render() {
    if (!this.state.categories || !this.state.images) {
      return <Spin />;
    }
    let currentCategory = this.state.categories[0];
    if (this.props.params.categoryName) {
      for (let i=0; i<this.state.categories.length; i++) {
        if (this.props.params.categoryName === this.state.categories[i].name) {
          currentCategory = this.state.categories[i];
        }
      }
    }
    let images = this.state.images.filter(image => image.category === currentCategory.id);
    return (
      <Layout className='app-root'>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo">
            <img src={require('./logo.jpg')} />
          </div>
          <Menu
            theme={this.state.theme}
            mode={this.state.mode}
            openKeys={this.state.openKeys}
            selectedKeys={[currentCategory.name]}
            onOpenChange={this.onOpenChange}
          >
            <SubMenu
              key="portfolio"
              title={<span><Icon type="appstore-o" /><span className="nav-text">Portfolio</span></span>}
            >
              {this.state.categories.filter(category => !category.is_full_size).map((category) => (
                <Menu.Item key={category.name}>
                  <Link to={`/${category.name}`}>{category.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
            <SubMenu
              key="illustration"
              title={<span><Icon type="file" /><span className="nav-text">Illustration</span></span>}
            >
              {this.state.categories.filter(category => category.is_full_size).map((category) => (
                <Menu.Item key={category.name}>
                  <Link to={`/${category.name}`}>{category.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <div className="content-header">
              <Breadcrumb
                theme={this.state.theme}
                style={{ margin: '12px 0' }}
              >
                <Breadcrumb.Item>{currentCategory.is_full_size ? 'Illustration' : 'Portfolio'}</Breadcrumb.Item>
                <Breadcrumb.Item>{currentCategory.name}</Breadcrumb.Item>
              </Breadcrumb>
              <div className="slider-container">
                <p>Image Size:</p>
                <Slider
                  min={100}
                  max={400}
                  step={100}
                  theme={this.state.theme}
                  value={this.state.imageSize}
                  tipFormatter={this.formatter}
                  onChange={this.onImageSizeChange}
                />
              </div>
            </div>
            <div>
              {
                currentCategory.is_full_size ?
                null :
                <Portfolio
                  images={images}
                  imageSize={this.state.imageSize}
                />
              }
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <p>Contact: <a href="mailto:Triplesludgeballs@gmail.com">Triplesludgeballs@gmail.com</a></p>
            <p>Sicong Sui 2016</p>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

class AppRouter extends Component {

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="/:categoryName" component={App} />
        </Route>
      </Router>
    )
  }
}

export default AppRouter;
