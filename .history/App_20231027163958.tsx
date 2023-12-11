import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Admob from './admob';

let intervalStartId: any;
let intervalPauseId: any;

export default function App() {
  const [wage, setWage] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState(0);
  const [startFormatTime, setStartFormatTime] = useState('');
  const [endTime, setEndTime] = useState(0);
  const [endFormatTime, setEndFormatTime] = useState('');
  const [startIncrementing, setStartIncrementing] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState('USD');

  const getCurTime = () => {
    const date = new Date();
    const seconds = Math.floor(date.getTime() / 1000);
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
    return `${year}-${month}-${dates} ${hour}:${minute}:${second}`;
  };

  const startTimer = async (isPlaying: boolean) => {
    setStartIncrementing(isPlaying);

    if (pauseStartTime !== 0) {
      // 새로 정지한 시간
      const _pausedTime = getCurTime() - pauseStartTime;
      console.log(_pausedTime);

      setPausedTime(prevPausedTime => prevPausedTime + _pausedTime);
      setPauseStartTime(0);
    }

    if (startTime === 0) {
      setStartTime(getCurTime());
    }
    setEndTime(getCurTime());
  };

  const calculateWage = useCallback(() => {
    const currendtEndTime = getCurTime();
    setEndTime(currendtEndTime);
    const _wage =
      (currendtEndTime - startTime - pausedTime) * (increment / 3600);
    setWage(_wage);
    setEndFormatTime(getFormatTime(currendtEndTime));
  }, [increment, pausedTime, startTime]);

  const syncFormatTime = useCallback(() => {
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
  }, [startTime, endTime]);

  const resetWage = async () => {
    startTimer(false);
    setWage(0);
    setStartTime(0);
    setEndTime(0);
    setPausedTime(0);
    setPauseStartTime(0);
    syncFormatTime();
    clearInterval(intervalStartId);
    clearInterval(intervalPauseId);
  };

  const changeValue = (value: string) => {
    setCurrencyUnit(value);
    resetWage();
  };

  useEffect(() => {
    syncFormatTime();
    if (startIncrementing) {
      /* if (intervalPauseId) {
        clearInterval(intervalPauseId);
      } */
      intervalStartId = setInterval(calculateWage, 1000);
    } else if (!startIncrementing && startTime !== 0) {
      clearInterval(intervalStartId);
      setPauseStartTime(getCurTime());
      // intervalPauseId = setInterval(startPausedTime, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIncrementing, startTime]);

  return (
    <View style={[styles.container, {backgroundColor: '#333'}]}>
      <View style={styles.col}>
        <Text style={[styles.title, {}]}>Total Wage</Text>
        <Text style={[styles.moneyText, {}]}>
          {currencyUnit === 'USD'
            ? `$${wage.toFixed(2)}`
            : `${wage.toFixed(0)} 원`}
        </Text>
      </View>
      <View style={styles.col}>
        <Text style={[styles.title, {}]}>Start Time</Text>
        <Text style={[styles.moneyText, {}]}>{startFormatTime}</Text>
      </View>
      <View style={styles.col}>
        <Text style={[styles.title, {}]}>End Time</Text>
        <Text style={[styles.moneyText, {}]}>{endFormatTime}</Text>
      </View>
      <View style={styles.col}>
        <Text style={[styles.title, {}]}>Pause Time</Text>
        <Text style={[styles.moneyText, {}]}>{pausedTime}s</Text>
      </View>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
  },
  moneyText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  col: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
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
