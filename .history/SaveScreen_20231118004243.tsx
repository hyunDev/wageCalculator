import React, {useState, useCallback} from 'react';
import {Text, View, FlatList, StyleSheet} from 'react-native';
import RNFS from 'react-native-fs';
import {useFocusEffect} from '@react-navigation/native';

export default function SaveScreen({}) {
  const [jsonData, setJsonData] = useState({});

  // 화면이 포커스될 때 실행
  useFocusEffect(
    useCallback(() => {
      // JSON 파일 경로 설정
      const filePath =
        RNFS.ExternalStorageDirectoryPath + '/Documents/wageCalculator.json';

      // JSON 파일을 읽어와서 데이터를 가져옴
      RNFS.readFile(filePath, 'utf8')
        .then(data => {
          const parsedData = JSON.parse(data);
          setJsonData(parsedData);
        })
        .catch(error => {
          console.error('파일 읽기 오류:', error);
        });
    }, []),
  );

  type itemProps = {
    item: {
      id: number;
      startDate: string;
      endDate: string;
      pausedTime: number;
      wage: string;
    };
  };
  const renderItem = ({item}: itemProps) => {
    return (
      <View style={styles.container}>
        <View>
          <Text>Order: {item.id}</Text>
        </View>
        <View>
          <Text>Start Date: {item.startDate}</Text>
        </View>
        <View>
          <Text>End Date: {item.endDate}</Text>
        </View>
        <View>
          <Text>Paused Time: {item.pausedTime}</Text>
        </View>
        <View>
          <Text>Wage: {item.wage}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={jsonData}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
      />
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
});
