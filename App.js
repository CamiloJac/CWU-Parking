import React, { Component } from 'react';
import { View, Button, FlatList, Text} from 'react-native';
import firebase from 'firebase';
import { firebaseConfig } from './config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export default class DatabaseComponent extends Component {
  state = {
    parkingLots: []
  };

  componentDidMount() {
    firebase.database().ref('parkingLots/').on('value', snapshot => {
      let data = snapshot.val();
      let parkingLots = Object.values(data);
      this.setState({ parkingLots });
    });
  }
  render() {
    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0}}>
        <View style={{
          backgroundColor: 'green',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: 64
        }}>
         <Button title="set" onPress={() => this.writeUserData('@gmail', 'D', 'w')} />
         <Button title="get" onPress={() => this.readUserData()} />
        </View>

        <FlatList
          data={this.state.parkingLots}
          renderItem={({item}) => 
            <Text style={{
              marginTop: 98,
              padding: 10,
              fontSize: 18,
              height: 44,}}>
                {item.LOT_ID}
            </Text>}
        />
      </View>
    );
  }
}