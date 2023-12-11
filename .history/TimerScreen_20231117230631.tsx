import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Pressable,
  Button,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Admob from './admob';
import RNFS from 'react-native-fs';
import DatePicker from 'react-native-date-picker';

let intervalStartId: any;
let intervalPauseId: any;

export default function TimerScreen({}) {
  const [wage, setWage] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [pausedTime, setPausedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState(0);
  const [startFormatTime, setStartFormatTime] = useState('');
  const [endTime, setEndTime] = useState(new Date());
  const [endFormatTime, setEndFormatTime] = useState('');
  const [startIncrementing, setStartIncrementing] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState('USD');

  const [open, setOpen] = useState(false);

  const getCurTime = () => {
    const date = new Date();
    const seconds = Math.floor(date.getTime() / 1000);
    return seconds;
  };

  const getFormatTime = (date: Date) => {
    // const date = new Date(seconds * 1000);
    const year = String(date.getFullYear()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dates = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${dates} ${hour}:${minute}:${second}`;
  };

  const startTimer = async (isPlaying: boolean) => {
    console.log('press startTime');
    setStartIncrementing(isPlaying);

    if (pauseStartTime !== 0) {
      // 새로 정지한 시간
      // console.log('curTime ::', getCurTime());
      console.log('pauseStartTime ::', pauseStartTime);
      console.log('pauseTime ::', pausedTime);
      const _pausedTime = getCurTime() - pauseStartTime;
      console.log(_pausedTime);

      setPausedTime(prevPausedTime => prevPausedTime + _pausedTime);
      setPauseStartTime(0);
    }

    if (!isPlaying) {
      // 정지 시작
      setPauseStartTime(getCurTime());
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
    setStartTime(new Date(0));
    setEndTime(new Date(0));
    setPausedTime(0);
    setPauseStartTime(0);
    syncFormatTime();
    clearInterval(intervalStartId);
    clearInterval(intervalPauseId);
  };

  async function readJsonData(): Promise<Object[]> {
    const savePath =
      RNFS.ExternalStorageDirectoryPath + '/Documents/wageCalculator.json';
    try {
      const data = await RNFS.readFile(savePath, 'utf8');
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (err) {
      return [];
    }
  }

  const save = async () => {
    const savePath =
      RNFS.ExternalStorageDirectoryPath + '/Documents/wageCalculator.json';
    // console.log(savePath);
    //파일 읽기
    let parsedData = await readJsonData();

    const _wage =
      currencyUnit === 'USD' ? `$${wage.toFixed(2)}` : `${wage.toFixed(0)} 원`;
    const jsonData = {
      startDate: getFormatTime(startTime),
      endDate: getFormatTime(endTime),
      pausedTime: pausedTime,
      wage: _wage,
      id: parsedData.length + 1,
    };
    parsedData.push(jsonData);
    console.log('push ::', parsedData);
    const jsonString = JSON.stringify(parsedData);
    // 파일 저장
    RNFS.writeFile(savePath, jsonString, 'utf8')
      .then(() => {
        Alert.alert('저장 성공', '파일이 성공적으로 저장되었습니다.', [
          {
            text: 'Cancel',
          },
        ]);
      })
      .catch(() => {
        Alert.alert('저장 실패', '파일 저장 중 오류가 발생했습니다:', [
          {
            text: 'OK',
          },
        ]);
      });
  };

  const changeValue = (value: string) => {
    setCurrencyUnit(value);
  };

  useEffect(() => {
    syncFormatTime();
    console.log('useEffect');
    if (startIncrementing) {
      /* if (intervalPauseId) {
        clearInterval(intervalPauseId);
      } */
      intervalStartId = setInterval(calculateWage, 1000);
    } else if (!startIncrementing && startTime !== 0) {
      clearInterval(intervalStartId);
      // setPauseStartTime(getCurTime());
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
        <Button title="Set Start Time" onPress={() => setOpen(true)} />
        <DatePicker
          modal
          open={open}
          date={startTime}
          onConfirm={date => {
            setOpen(false);
            setStartTime(date);
            syncFormatTime();
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
      <View style={styles.col}>
        <Text style={[styles.title, {}]}>End Time</Text>
        <Text style={[styles.moneyText, {}]}>{endFormatTime}</Text>
        <Button title="Set End Time" onPress={() => setOpen(true)} />
        <DatePicker
          modal
          open={open}
          date={endTime}
          onConfirm={date => {
            setOpen(false);
            setEndTime(date);
            syncFormatTime();
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
      <View style={styles.col}>
        <Text style={[styles.title, {}]}>Pause Time</Text>
        <Text style={[styles.moneyText, {}]}>{pausedTime}s</Text>
      </View>
      {/* <Text style={[styles.moneyText, {}]}>{formatTime(timer)}</Text> */}
      <TextInput
        style={styles.input}
        // onChangeText={text => setIncrement(parseFloat(text))}
        onChangeText={value => setIncrement(parseFloat(value))}
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
      <View style={styles.rowBtn}>
        <Pressable
          style={styles.btn}
          // onPress={() => setStartIncrementing(!startIncrementing)}
          onPress={() => startTimer(!startIncrementing)}>
          <Text style={styles.btnText}>
            {' '}
            {startIncrementing ? 'Stop' : 'Start'}{' '}
          </Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={resetWage}>
          <Text style={styles.btnText}>Reset</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={save}>
          <Text style={styles.btnText}>Save</Text>
        </Pressable>
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
  btnText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  rowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  btn: {
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 4,
    width: 80,
    marginRight: 3,
  },
});
