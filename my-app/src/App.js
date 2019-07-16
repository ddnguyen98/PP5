import React, {Component} from 'react';



class App extends Component{
  state ={
    uinfo: [],
    dog: [],
    isLoadingInfo: false,
    isLoadingDog: false
  }


  loadApi(){
    if(this.state.isLoadingInfo === false && this.state.isLoadingDog === false){
      this.loadDetailsPerson();
     }
    else if(this.state.isLoadingInfo === true && this.state.isLoadingDog === false){
      this.loadDetailsDog();
    }
  }

  loadDetailsPerson(){
    fetch('https://randomuser.me/api/')
    .then(response => { return response.json() })
    .then(data => {
      let reg =/^[a-zA-Z]+$/;
      if(!reg.test(data.results[0].name.first.toLowerCase())){
        this.loadDetailsPerson();
      }
      this.setState({uinfo : data.results[0], isLoadingInfo: true})})
  }

  loadDetailsDog(){
    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${this.state.uinfo.name.first[0]}`)
    .then(response => { return response.json() })
    .then(data => {
      for (let i = 0; i < data.length; i++) {  
        if(data[i].name[0].toLowerCase() === this.state.uinfo.name.first[0].toLowerCase()){
          this.setState({dog : data[i], isLoadingDog: true})
          break;
        }
      }
    })
  }

  showContent(){

  }

  render(){
    let { isLoadingInfo, isLoadingDog, uinfo, dog } = this.state
    this.loadApi();

  
      if(isLoadingDog === false || isLoadingInfo === false){
        return <div>Loading Content</div>
      }
      else if(isLoadingDog === true || isLoadingInfo === true){
        return (
            <div style={styles.container} id="changeme">
            <p>{dog.name}</p>
            <p>{uinfo.name.first}</p>
            <p>Hello my name is {uinfo.name.first} and I am {dog.temperament}.</p>
            <p>My owner is called {uinfo.name.title} {uinfo.name.last}.</p>
            <p>You can contact my owner at {uinfo.email}.</p>
          </div>
        );
      }  
  }
}

export default App;

const styles = {
  container: {}
}
