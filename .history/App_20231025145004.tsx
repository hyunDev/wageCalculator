import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
// import BackgroundService from 'react-native-background-actions';
import Admob from './admob';

/* const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'exampleScheme://chat/jane',
  parameters: {
    delay: 1000,
  },
}; */
let intervalId: any;

/* const sleep = (time: number | undefined) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time)); */

export default function App() {
  const [wage, setWage] = useState(0);
  const [increment, setIncrement] = useState(0);
  // const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [startFormatTime, setStartFormatTime] = useState('');
  const [endTime, setEndTime] = useState(0);
  const [endFormatTime, setEndFormatTime] = useState('');
  const [startIncrementing, setStartIncrementing] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState('USD');

  /* const setCalculate = async (taskData: any) => {
    await new Promise(async () => {
      // For loop with a delay
      const {delay} = taskData;
      console.log(BackgroundService.isRunning(), delay);
      for (let i = 0; BackgroundService.isRunning(); i++) {
        await BackgroundService.updateNotification({
          taskDesc: 'Runned -> ' + i,
        });
        await sleep(delay);
      }
    });
  }; */

  const getCurTime = () => {
    const date = new Date();
    const seconds = Math.floor(date.getTime() / 1000);
    console.log(seconds);
    return seconds;
  };

  const getFormatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const year = String(date.getFullYear()).padStart(2, '0');
    const month = String(date.getMonth()).padStart(2, '0');
    const dates = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year} ${month} ${dates} ${hour}:${minute}:${second}`;
  };

  const startTimer = async (isPlaying: boolean) => {
    setStartIncrementing(isPlaying);
    setStartTime(getCurTime());
    setEndTime(startTime);
    syncFormatTime();
    if (isPlaying) {
      intervalId = setInterval(() => {
        // setTimer(time => time + 1);
        const _curTime = getCurTime();
        console.log('curTime ::', _curTime);
        setEndTime(_curTime);
        const _wage = (endTime - startTime) * (increment / 3600);
        console.log('endTime ::', endTime);
        console.log('startTime ::', startTime);

        console.log('wage ::', _wage);
        setWage(_wage);
        setEndFormatTime(getFormatTime(endTime));
      }, 1000);
      /* try {
        console.log('Trying to start background service');
        await BackgroundService.start(setCalculate, options);
        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      } */
    } else {
      // console.log('Stop background service');
      clearInterval(intervalId);
      // await BackgroundService.stop();
    }
  };

  /* useEffect(() => {
    if (startIncrementing) {
      const intervalId = setInterval(() => {
        setWage(currentWage => currentWage + increment / 3600);
        setTimer(time => time + 1);
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [startIncrementing, increment]);
 */
  const syncFormatTime = () => {
    if (startTime === 0) {
      setStartFormatTime('0');
    } else {
      setStartFormatTime(getFormatTime(startTime));
    }

    if (endTime === 0) {
      setEndFormatTime('0');
    } else {
      setEndFormatTime(getFormatTime(endTime));
    }
  };

  const resetWage = async () => {
    setWage(0);
    // setTimer(0);
    setStartTime(0);
    setEndTime(0);
    syncFormatTime();
    setStartIncrementing(false);
    /* if (BackgroundService.isRunning()) {
      clearInterval(intervalId);
      await BackgroundService.stop();
    } */
  };

  /* const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  }; */

  const changeValue = (value: string) => {
    setCurrencyUnit(value);
    resetWage();
  };

  return (
    <View style={[styles.container, {backgroundColor: '#333'}]}>
      <Text style={[styles.moneyText, {}]}>
        {currencyUnit === 'USD'
          ? `$${wage.toFixed(2)}`
          : `${wage.toFixed(0)} 원`}
      </Text>
      <Text style={[styles.moneyText, {}]}>Start Time {startFormatTime}</Text>
      <Text style={[styles.moneyText, {}]}>End Time {endFormatTime}</Text>
      {/* <Text style={[styles.moneyText, {}]}>{formatTime(timer)}</Text> */}
      <TextInput
        style={styles.input}
        onChangeText={text => setIncrement(parseFloat(text))}
        placeholder="Enter hourly wage increment"
        keyboardType="numeric"
      />
      <View style={styles.row}>
        {/* <RNPickerSelect
          placeholder={{
            label: 'Please select a currency unit',
            value: null,
          }}
          onValueChange={value => changeValue(value)}
          fixAndroidTouchableBug={true}
          useNativeAndroidPickerStyle={false}
          items={[
            {label: 'USD', value: 'USD'},
            {label: 'KRW', value: 'KRW'},
          ]}
        /> */}
      </View>
      <View style={styles.row}>
        <Button
          // onPress={() => setStartIncrementing(!startIncrementing)}
          onPress={() => startTimer(!startIncrementing)}
          title={startIncrementing ? 'Stop' : 'Start'}
        />
      </View>
      <View style={styles.row}>
        <Button onPress={resetWage} title="Reset" />
      </View>
      <Admob />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    width: '80%',
  },
  moneyText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: '#fff',
  },
  icon: {
    marginRight: 10,
  },
});
