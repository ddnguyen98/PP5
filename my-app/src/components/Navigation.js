import React, {Component} from 'react';
import * as firebase from 'firebase';
import {Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'


class Navigation extends Component{
    state={
        email: '',
        password: '',
        status: ''
    }
    //Checks for current user if logged in previously
    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.setState({status: false})
            }
            else{
                this.setState({status: true})
            }
        })


    }
    
    //Checks for correct login
    submitLogin = e =>{ 
        const { email, password } = this.state;
    
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(){console.log('Logged in')})
        .catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage);
          });
    }
    //Creates account based on details submited and matches it with users on database to see if they exist
    createAccount = e =>{
    const { email, password } = this.state;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(){
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref(`users/${user.uid}`).set({
                dogdates: ' ',
                bio: 'Enter dog bio here',
                dogAge: 'Age of dog',
                dogBreed: 'Breed of dog',
                dogName: 'Dogs name',
                first: 'Your first name',
                last: 'your Last name'
                })
        })
    })
    .catch(function(error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage);
        });
    }
    //Gathers values to be collected for submit
    loginValue = e =>{

    if(e.target.id === 'email'){
        this.setState({email: e.target.value})
    }
    else{
        this.setState({password: e.target.value})
    } 
    }
    //logs out current user.
    logOut = e =>{
    firebase.auth().signOut().then(function() {
        console.log('Logout')
        }).catch(function(error) {
        });
    }

  render(){
      //If logged in will change navbar
    const {status} = this.state;
    if(status){
        return(
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto justify-content-end">
                        <Nav.Link href="/">Home</Nav.Link>
                        </Nav>
                        <Form inline>
                            <FormControl type="email" placeholder="Email" className="mr-sm-2" id="email" onChange={this.loginValue}/>
                            <FormControl type="password" placeholder="Password" className="mr-sm-2" id="password" onChange={this.loginValue}/>
                            <Button variant="outline-success" onClick={this.submitLogin}>Login</Button>
                            <Button variant="outline-success" onClick={this.createAccount}>Sign Up</Button>
                        </Form>
                </Navbar.Collapse>
            </Navbar>
        )
    }
    else{
        return(
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto justify-content-end">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="#/profile">Profile</Nav.Link>
                        <Nav.Link href="#/message">Message</Nav.Link>
                        </Nav>
                        <Nav.Link href="/"><Button variant="outline-success" onClick={this.logOut}>Logout</Button></Nav.Link>

                </Navbar.Collapse>
            </Navbar>
        )
    }

    
   
   }
}

export default Navigation;

const styles = {
  container: {}
}
