import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';

//timer functional component
function Timer({ interval }) {
  const duration = moment.duration(interval);
  //simple padding function for displayed numbers
  const pad = (n) => {
    return (n < 10) ? '0'+n : n;
  }
  let centiseconds = Math.floor(duration.milliseconds()/10);
  return (
    <Text style={styles.timer}>
      {pad(duration.minutes())}:{pad(duration.seconds())}.{pad(centiseconds)}
    </Text>
  )
}

//round button functional component
function RoundButton({title, color, background, onPress}) { 
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.button, {backgroundColor: background}]}>
      <View style={styles.buttonBorder}>
        <Text style={[styles.buttonTitle, {color}]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default class TimerScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) { 
    let intervalsArray = [10000,10000,10000,10000]
    super(props);
    //initialize state to start with first interval
    this.state = {
      start: 0,
      now: 0,
      intervals: intervalsArray,
      index: 1,
      prev: 0,
      stopped: true,
      currentInterval: intervalsArray[0],
      stopResetText: '',
      bgColor: '#fef9ed',
      started: false
    }
  }

  start = () => {
    if(!this.state.started) {  //handle multiple start presses
      const now = new Date().getTime();
      this.setState({
        start: now - this.state.prev,
        now,
        index: 1,
        stopped: false,
        stopResetText: 'Stop',
        bgColor: ((this.state.index)%2) ? '#57b766' : '#1b8cfe',
        started: true
      });
      this.timer = setInterval(() => {
        const {start, currentInterval, index, intervals} = this.state;
        let now = new Date().getTime();
        let timer = currentInterval - (now - start);
        if(timer > 0) {   //if timer isn't done, update it
          this.setState({now: now})
        } else if(index !== intervals.length) { //if timer is done and there are more intervals left, update to new interval
          this.setState({
            prev: 0,
            now: now,
            start: now,
            currentInterval: intervals[index],
            index: index + 1,
            bgColor: ((index)%2) ? '#1b8cfe' : '#57b766'   
          });
        } else {                          //if timer is done and all intervals are finished, reset to initial state
          clearInterval(this.timer);
          this.setState({ 
            start: 0,
            now: 0,
            index: 1,
            prev: 0,
            stopped: true,
            currentInterval: intervals[0],
            stopResetText: '',
            bgColor: '#fef9ed',
            started: false
          })
        }
      }, 100);
    }
  }
  stop = () => {
    const {now, start, intervals, stopped} = this.state;
    clearInterval(this.timer);
    if(!stopped) {
      this.setState({
        stopped:true,
        prev: now-start,
        stopResetText: 'Reset',
        bgColor: '#fef9ed',
        started: false
      })
    } else {
      this.setState({
        prev: 0,
        now: 0,
        start: 0,
        currentInterval: intervals[0],
        index: 1,
        stopResetText: '',
      })
    }
  }

  render() {
    const {now, start, currentInterval, stopResetText, bgColor} = this.state;
    const timer = currentInterval - (now-start);
    return (
      <View style={[styles.container,{backgroundColor: bgColor}]}>
        <Timer interval={timer}></Timer>
        <View style={styles.buttonsContainer}>
          <RoundButton title="Start" color="#FFFFFF" background="#1B672F" onPress={this.start} ></RoundButton>
          <RoundButton title={stopResetText} color="#ffffff" background={stopResetText === '' ? "#8b8b8b" : "#a60000"} onPress={this.stop} ></RoundButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 130,
    paddingHorizontal: 20
  },
  timer: {
    fontWeight: '200',
    fontSize: 80,
    fontFamily: 'Menlo'
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 22
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: 50,
    paddingHorizontal: 50
  }
});
