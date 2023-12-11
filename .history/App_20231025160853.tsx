import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
import Admob from './admob';

let intervalId: any;

export default function App() {
  const [wage, setWage] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [startFormatTime, setStartFormatTime] = useState('');
  let [endTime, setEndTime] = useState(0);
  const [endFormatTime, setEndFormatTime] = useState('');
  const [startIncrementing, setStartIncrementing] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState('USD');

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
        const _curTime = getCurTime();
        // setEndTime(_curTime);
        endTime = _curTime;
        const _wage = (endTime - startTime) * (increment / 3600);
        setWage(_wage);
        setEndFormatTime(getFormatTime(endTime));
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
  };

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
    setStartTime(0);
    setEndTime(0);
    syncFormatTime();
    setStartIncrementing(false);
  };

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
        <RNPickerSelect
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
        />
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
