import React, {Component} from 'react';
import {Card, Container, Form, Table,Button} from 'react-bootstrap'
import * as firebase from 'firebase';





class Profile extends Component{
    state={
        email:'',
        dogName:'',
        dogBreed:'',
        dogAge:'',
        firstName:'',
        lastName:'',
        bio:'',
        dogdates:[],
        loaded:false
    }
    //Checks current user and then sets state along with other info to be stored in the form + table 
    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({email: user.email})
            firebase.database().ref('/users/' + user.uid).once('value').then((snapshot)=>{
                this.setState({
                    dogName: snapshot.val().dogName, 
                    dogAge: snapshot.val().dogAge, 
                    dogBreed: snapshot.val().dogBreed, 
                    firstName: snapshot.val().first, 
                    lastName: snapshot.val().last, 
                    bio: snapshot.val().bio,
                })
                snapshot.child('dogdates').forEach(test=>{
                    this.state.dogdates.push(test.val())
                })
                this.setState({loaded: true})
            });
        })
    }
    //Checks inputs on change and edits state values
    storeInfo = e =>{
        this.setState({[e.target.id]: e.target.value})
    }
    //Edits info of info you have entered
    updateInfo = e =>{
        const {dogName, dogAge, dogBreed, firstName, lastName, bio} = this.state
        let user = firebase.auth().currentUser;
        firebase.database().ref('/users/' + user.uid).once('value').then((snapshot)=>{
            if (user != null) {
                firebase.database().ref(`users/${user.uid}`).set({
                    dogdates: snapshot.val().dogdates,
                    bio: bio,
                    dogAge: dogAge,
                    dogBreed: dogBreed,
                    dogName: dogName,
                    first: firstName,
                    last: lastName
                })
            }
        })

    }

    render(){
        const {dogName, dogAge, dogBreed, firstName, lastName, bio, loaded, dogdates} = this.state


        return(
            <Container>
                <Card>
                    <Card.Body> 
                        <img src="https://pawedin.com/system/pets/default_images/default_pet.jpg" width="200" height="200"></img>                 
                    <Form>
                        <Form.Group controlId="dogName">
                            <Form.Control type="text" value={dogName} onChange={this.storeInfo} />
                        </Form.Group>
                        <Form.Group controlId="dogBreed">
                            <Form.Control type="text" value={dogBreed} onChange={this.storeInfo}/>
                        </Form.Group>
                        <Form.Group controlId="dogAge">
                            <Form.Control type="text" value={dogAge} onChange={this.storeInfo}/>
                        </Form.Group>
                        <Form.Group controlId="firstName">
                            <Form.Control type="text" value={firstName} onChange={this.storeInfo}/>
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Control type="text" value={lastName} onChange={this.storeInfo}/>
                        </Form.Group>
                        <Form.Group controlId="bio">
                            <Form.Control as="textarea" rows="3" value={bio} onChange={this.storeInfo}/>
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={this.updateInfo}>
                            Update
                        </Button>
                    </Form>
                    </Card.Body>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Yes</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>NO</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    </Table>
                </Card>              
            </Container>
        )
    }
}

export default Profile;

const styles = {
  container: {}
}