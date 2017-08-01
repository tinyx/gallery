import React, { Component } from 'react';
import { Spin, Layout, Menu, Breadcrumb, Switch } from 'antd';
import { browserHistory, Router, Route, Link } from 'react-router'
import Illustration from './components/Illustration';

import 'antd/dist/antd.css';
import './App.css';

const Header = Layout.Header;

class App extends React.Component {
  state = {
    categories: null,
    images: null,
    theme: 'dark',
    selectedItems: {},
    browseModes: {},
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
  switchMode = (browseMode, currentCategory) => {
    this.setState({
      browseModes: {
        ...this.state.browseModes,
        [currentCategory]: browseMode,
      },
    });
  }
  setSelectedItem = (selectedItem, currentCategory) => {
    this.setState({
      selectedItems: {
        ...this.state.selectedItems,
        [currentCategory]: selectedItem,
      },
      browseModes: {
        ...this.state.browseModes,
        [currentCategory]: true,
      }
    });
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
        <Header className='page-header'>
          {/*
            <div className="logo">
              <img src={require('./logo.jpg')} alt='Gallery' />
            </div>
            */
          }
          <Menu
            theme={this.state.theme}
            mode='horizontal'
            selectedKeys={[currentCategory.name]}
          >
            {this.state.categories.map((category) => (
              <Menu.Item key={category.name}>
                <Link to={`/${category.name}`}>{category.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Header>
        <Layout className='white'>
          <Header className='content-header white'>
            <Breadcrumb
              theme={this.state.theme}
              style={{ margin: '12px 0' }}
            >
              <Breadcrumb.Item>{currentCategory.name}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="slider-container">
              <p>Browse Mode:&nbsp;&nbsp;</p>
              <Switch
                checked={
                  currentCategory.id in this.state.browseModes ?
                  this.state.browseModes[currentCategory.id] :
                  true
                }
                onChange={(mode) => this.switchMode(mode, currentCategory.id)}
              />
            </div>
          </Header>
          <Illustration
            key={currentCategory.id}
            images={images}
            browseMode={
              currentCategory.id in this.state.browseModes ?
              this.state.browseModes[currentCategory.id] :
              true
            }
            selectedItem={
              currentCategory.id in this.state.selectedItems ?
              this.state.selectedItems[currentCategory.id] :
              0
            }
            switchMode={(mode) => this.switchMode(mode, currentCategory.id)}
            setSelectedItem={(item) => this.setSelectedItem(item, currentCategory.id)}
          />
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
