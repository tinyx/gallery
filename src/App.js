import React, { Component } from 'react';
import { Spin, Layout, Menu, Breadcrumb, Icon, Slider, Switch } from 'antd';
import { browserHistory, Router, Route, Link } from 'react-router'

import Portfolio from './components/Portfolio';
import Illustration from './components/Illustration';

import 'antd/dist/antd.css';
import './App.css';


const { Content, Footer, Sider, Header } = Layout;
const SubMenu = Menu.SubMenu;

class App extends React.Component {
  state = {
    mode: 'inline',
    openKeys: ['portfolio', 'illustration'],
    categories: null,
    images: null,
    imageSize: 300,
    theme: 'dark',
    selectedItem: 0,
    browseMode: true,
  };
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
      default: return 'Large';
    }
  }
  switchMode = (browseMode) => {
    this.setState({
      browseMode
    });
  }
  setSelectedItem = (selectedItem) => {
    this.setState({
      selectedItem
    }, () => this.switchMode(true));
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
        <Sider>
          <div className="logo">
            <img src={require('./logo.jpg')} alt='Gallery' />
          </div>
          <Menu
            theme={this.state.theme}
            mode={this.state.mode}
            openKeys={this.state.openKeys}
            selectedKeys={[currentCategory.name]}
            onOpenChange={this.onOpenChange}
          >
            {this.state.categories.filter(category => !category.is_full_size).map((category) => (
              <Menu.Item key={category.name}>
                <Link to={`/${category.name}`}>{category.name}</Link>
              </Menu.Item>
            ))}
            {this.state.categories.filter(category => category.is_full_size).map((category) => (
              <Menu.Item key={category.name}>
                <Link to={`/${category.name}`}>{category.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Header>
            <Breadcrumb
              theme={this.state.theme}
              style={{ margin: '12px 0' }}
            >
              <Breadcrumb.Item>{currentCategory.is_full_size ? 'Illustration' : 'Portfolio'}</Breadcrumb.Item>
              <Breadcrumb.Item>{currentCategory.name}</Breadcrumb.Item>
            </Breadcrumb>
            { !currentCategory.is_full_size ?
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
              </div> :
              <div className="slider-container">
                <p>Browse Mode:&nbsp;&nbsp;</p>
                <Switch
                  checked={this.state.browseMode}
                  onChange={this.switchMode}
                />
              </div>
            }
          </Header>
          {
            currentCategory.is_full_size ?
            <Illustration
              images={images}
              browseMode={this.state.browseMode}
              switchMode={this.switchMode}
              setSelectedItem={this.setSelectedItem}
              selectedItem={this.state.selectedItem}
            /> :
            <Content>
              <Portfolio
                images={images}
                imageSize={this.state.imageSize}
              />
            </Content>
          }
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
