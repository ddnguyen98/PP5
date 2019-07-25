import React, { Component } from 'react';
import * as firebase from 'firebase';
import {Card, Container, Button, Spinner} from 'react-bootstrap'
import { HashRouter, Route, Link } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'
import Profile from './Profile';

class Home  extends Component {
    
  state ={
    uFirst: '',
    uLast: '',
    uEmail: '',
    dogAge: '',
    dogBreed: '',
    dogName: '',
    dogTemp:'',
    dogid: '',
    dogimg: null,
    isLoadingInfo: false,
    isLoadingDog: false,
    }

  // Loads all current api details
  loadApi = e =>{
    if(this.state.isLoadingInfo === false && this.state.isLoadingDog === false){
      this.loadDetailsPerson();
     }
    else if(this.state.isLoadingInfo === true && this.state.isLoadingDog === false){
      this.loadDetailsDog();
    }
  }

  loadDetailsDname = e =>{
    fetch('https://randomuser.me/api/')
    .then(response => { return response.json() })
    .then(data => {
      let reg =/^[a-zA-Z]+$/;
      if(!reg.test(data.results[0].name.first)){
        this.loadDetailsDname();
      }
      else{
        this.setState({dogName : data.results[0].name.first})
      }
    })
  }

  loadDetailsPerson = e =>{
    fetch('https://randomuser.me/api/')
    .then(response => { return response.json() })
    .then(data => {
      let reg =/^[a-zA-Z]+$/;
      if(!reg.test(data.results[0].name.first) || !reg.test(data.results[0].name.last)){
        this.loadDetailsPerson();
      }
      else{
        this.setState({uFirst : data.results[0].name.first, uLast : data.results[0].name.last, uEmail : data.results[0].email, isLoadingInfo: true}) 
        this.loadDetailsDname();
      }
    })
  }

  loadDetailsDog = e =>{
    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${this.state.uFirst[0]}`)
    .then(response => { return response.json() })
    .then(data => {
      for (let i = 0; i < data.length; i++) {  
        if(data[i].name[0].toLowerCase() === this.state.uFirst[0].toLowerCase()){
          this.setState({dogBreed : data[i].name, isLoadingDog: true})
          this.setState({dogAge: Math.floor(Math.random() * 10 + 1)})
          this.setState({dogid: data[i].id})
          this.setState({dogTemp: data[i].temperament})
          if(typeof data[i].temperament === 'undefined'){
            this.setState({dogTemp: "Happy, Loving, Kind"});
          }
          if(this.state.dogimg === null){

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

  //Random id for random users being stored
  create_UUID = e =>{
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c==='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  
  }

  //Add dogs to list to be view on profile later
  yesDogs = e =>{
    let randomId = this.create_UUID();
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          firebase.database().ref(`users/${user.uid}/dogdates/${randomId}`).set({
            dogAge: this.state.dogAge,
            dogBreed: this.state.dogBreed,
            dogName: this.state.dogName,
            dogImage: this.state.dogimg,
            dogTemp: this.state.dogTemp,
            email: this.state.uEmail,
            first: this.state.uFirst,
            last: this.state.uLast,
            status: 'yes',
          }); 
        }
      });
    this.setState({isLoadingDog: false, isLoadingInfo: false, dogimg: null})
    this.loadApi();
  }

  noDogs = e =>{
    let randomId = this.create_UUID();
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          firebase.database().ref(`users/${user.uid}/dogdates/${randomId}`).set({
            dogAge: this.state.dogAge,
            dogBreed: this.state.dogBreed,
            dogName: this.state.dogName,
            dogImage: this.state.dogimg,
            dogTemp: this.state.dogTemp,
            email: this.state.uEmail,
            first: this.state.uFirst,
            last: this.state.uLast,
            status: 'no',
          }); 
        }
      });
    this.setState({isLoadingDog: false, isLoadingInfo: false, dogimg: null})
    this.loadApi();
  }
  //store more than 1 user to load data, holder user data in set state along with details of dog you will be viewing
 
    render(){
        let { isLoadingInfo, isLoadingDog, uEmail, uFirst, uLast, dogAge, dogBreed, dogName, dogimg, dogTemp } = this.state
        if(isLoadingDog === false || isLoadingInfo === false ){
          this.loadApi();
        }
    
        if(isLoadingDog === false || isLoadingInfo === false ){
          return( 
          <Container>
            <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
          </Spinner>
        </Container>
        )
        }
        else if(isLoadingDog === true && isLoadingInfo === true){
          return(
            <HashRouter>
              <Navigation/>
              <Route exact path="/" render={()=>{
                return(
                  <Container>
                    <Card>
                      <Card.Body>                  
                        <img src={dogimg} alt="Dog Img" height="200" width="200"></img>
                        <p id="">{dogBreed}</p>
                        <p id="">{dogAge}</p>
                        <p>Hello my name is {dogName} and I am {dogTemp}.</p>
                        <p>My owner is called {uFirst} {uLast}.</p>
                        <p>You can contact my owner at {uEmail}.</p>
                        <button onClick={this.yesDogs}>Playdate</button>
                        <button onClick={this.noDogs}>No Thanks</button>
                        </Card.Body>
                    </Card>              
                  </Container>
                  )
              }}/>
              <Route path="/profile" render={()=>{
                return(
                  <Profile/>
                )
              }}/>
              <Footer/>
              </HashRouter>
          );
        }  
    }

}

export default Home

const styles = {
  container: {}
}