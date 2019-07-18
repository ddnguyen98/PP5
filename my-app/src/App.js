import React, {Component} from 'react';



class App extends Component{
  state ={
    uinfo: [],
    dog: [],
    dogName: '',
    dogTemp:[],
    dogid: '',
    dogimg: null,
    isLoadingInfo: false,
    isLoadingDog: false
    }


  loadApi = e =>{

    console.log('loadApi')
    if(this.state.isLoadingInfo === false && this.state.isLoadingDog === false){
      console.log('loadperson')
      this.loadDetailsPerson();
     }
    else if(this.state.isLoadingInfo === true && this.state.isLoadingDog === false){
      console.log('loadDog')
      this.loadDetailsDog();
    }

  }

  loadDetailsDname = e =>{
    console.log('loadgname')
    fetch('https://randomuser.me/api/')
    .then(response => { return response.json() })
    .then(data => {this.setState({dogName : data.results[0].name.first})})
  }

  loadDetailsPerson = e =>{
    fetch('https://randomuser.me/api/')
    .then(response => { return response.json() })
    .then(data => {
      let reg =/^[a-zA-Z]+$/;
      if(!reg.test(data.results[0].name.first)){
        console.log('Error');
        this.loadApi();
      }
      else{
        this.setState({uinfo : data.results[0], isLoadingInfo: true}) 
        this.loadDetailsDname();
      }
    })
  }

  loadDetailsDog = e =>{
    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${this.state.uinfo.name.first[0]}`)
    .then(response => { return response.json() })
    .then(data => {
      for (let i = 0; i < data.length; i++) {  
        if(data[i].name[0].toLowerCase() === this.state.uinfo.name.first[0].toLowerCase()){
          this.setState({dog : data[i], isLoadingDog: true})
          this.setState({dogid: data[i].id})
          this.setState({dogTemp: data[i].temperament})
          if(typeof data[i].temperament === 'undefined'){
            console.log('Test')
            this.setState({dogTemp: "Happy, Loving, Kind"});
          }
          if(this.state.dogimg === null){
            console.log('img')

            fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${this.state.dogid}`)
            .then(response => { return response.json() })
            .then(info =>{
              if(info.length === 0){
                this.setState({dogimg: "https://cdn2.thedogapi.com/images/WIf5o1E8h.jpg"})
              }
              else{
                this.setState({dogimg: info[0].url})
              }
            })
          }

          break;
        }
      }
    })
  }

  changeContents = e =>{
    console.log('hi')
    this.setState({isLoadingDog: false, isLoadingInfo: false, dogimg: null})
    this.loadApi();
  }


  render(){
    console.log(this.state);
    let { isLoadingInfo, isLoadingDog, uinfo, dog, dogName, dogimg, dogTemp } = this.state
      if(isLoadingDog === false || isLoadingInfo === false ){
        this.loadApi();
      }
  
      if(isLoadingDog === false || isLoadingInfo === false ){
        return <div>Loading Content</div>
      }
      else if(isLoadingDog === true && isLoadingInfo === true){
        return(
            <div style={styles.container} id="changeme">
            <img src={dogimg} alt="Dog Img" height="100" width="100"></img>
            <p id="">{dog.name}</p>
            <p>Hello my name is {dogName} and I am {dogTemp}.</p>
            <p>My owner is called {uinfo.name.first} {uinfo.name.last}.</p>
            <p>You can contact my owner at {uinfo.email}.</p>
            <button onClick={this.changeContents}>Test</button>
            </div>
        );
      }  
   }
}

export default App;

const styles = {
  container: {}
}
