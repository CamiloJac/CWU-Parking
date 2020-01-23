import React from 'react'
import {Text, TouchableOpacity, View, Dimensions, ScrollView, Button} from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel'

import MapView, { Marker } from 'react-native-maps';
import data from './data.json';

const {height} = Dimensions.get('window')

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center'
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-around'
    
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: '#2b8a3e',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1
  }
}

class BottomSheet extends React.Component {
  _onClick(Index) {
    this.setState({lotIndex: Index});
    this._panel.show(height*0.15);
  }

  state = { lotIndex: 0 }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {this._onClick(0)}}>
          <View>
            <Text>Show0</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this._onClick(1)}}>
          <View>
            <Text>Show1</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this._onClick(2)}}>
          <View>
            <Text>Show2</Text>
          </View>
        </TouchableOpacity>

        <SlidingUpPanel
          ref={c => (this._panel = c)}
          draggableRange={{top: height*0.95, bottom: 0}}
          animatedValue={this._draggedValue}
          showBackdrop={true}>
          <View style={styles.panel}>
            <Text style={{margin:25}}>{data.parkingLots[this.state.lotIndex].Description}</Text>
            <Button 
              margin
              title="Directions"
            />
          </View>
        </SlidingUpPanel>
      </View>
    )
  }
}

export default BottomSheet
