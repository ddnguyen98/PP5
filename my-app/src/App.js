import React, {Component} from 'react';
import './App.css';
import Dummy from './components/Dummy/Dummy';
import Smart from './components/Smart/Smart';


class App extends Component{
  render(){
    return (
      <div style={styles.container}>
        <Dummy paraText="Page 2" />
        <Smart paraText="Page 3" />
        <p>Page 1</p>
      </div>
    );
  }
}

export default App;

const styles = {
  container: {}
}
