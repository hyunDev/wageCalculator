import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
// import {BannerAd, BannerAdSize, TestIds} from '@react-native-admob/admob';

export default function App() {
  const [wage, setWage] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [timer, setTimer] = useState(0);
  const [startIncrementing, setStartIncrementing] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState('USD');

  useEffect(() => {
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

  const resetWage = () => {
    setWage(0);
    setTimer(0);
    setStartIncrementing(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
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
      <Text style={[styles.moneyText, {}]}>{formatTime(timer)}</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setIncrement(parseFloat(text))}
        placeholder="Enter hourly wage increment"
        keyboardType="numeric"
      />
      <View style={styles.row}>
        {/* <Text style={styles.label}>Select Currency:</Text> */}
        {/* <Picker
          selectedValue={currencyUnit}
          onValueChange={itemValue => setCurrencyUnit(itemValue)}
          style={styles.picker}>
          <Picker.Item label="USD" value="USD" />
          <Picker.Item label="KRW" value="KRW" />
        </Picker> */}
        {/* <Switch
          value={currencyUnit === 'USD'}
          onValueChange={() =>
            setCurrencyUnit(currencyUnit === 'USD' ? 'KRW' : 'USD')
          }
        />*/}
        <RNPickerSelect
          placeholder={{
            label: 'Please select a currency unit',
            value: null,
          }}
          onValueChange={value => changeValue(value)}
          useNativeAndroidPickerStyle={false}
          items={[
            {label: 'USD', value: 'USD'},
            {label: 'KRW', value: 'KRW'},
          ]}
        />
      </View>
      <View style={styles.row}>
        <Button
          onPress={() => setStartIncrementing(!startIncrementing)}
          title={startIncrementing ? 'Stop' : 'Start'}
        />
      </View>
      <View style={styles.row}>
        <Button onPress={resetWage} title="Reset" />
      </View>
      {/* <BannerAd size={BannerAdSize.BANNER} unitId={TestIds.BANNER} /> */}
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

// ca-app-pub-3599250716372898~1981768371
// ca-app-pub-3599250716372898/7178254735
