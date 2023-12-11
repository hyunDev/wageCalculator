import React, {useState, useCallback} from 'react';
import {Text, View, FlatList} from 'react-native';
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
          console.log(parsedData);
          console.log(Object.entries(jsonData));
        })
        .catch(error => {
          console.error('파일 읽기 오류:', error);
        });
    }, []),
  );

  /* const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ]; */
  type itemProps = {
    item: {
      id: number;
      startDate: string;
      endDate: string;
      pausedTime: number;
      wage: number;
    };
  };
  const renderItem = ({item}: itemProps) => {
    return (
      <View>
        <View>
          <Text> id: {item.id}</Text>
        </View>
        {/* <View>
          <Text>startDate: {item.startDate}</Text>
        </View>
        <View>
          <Text>endDate: {item.endDate}</Text>
        </View>
        <View>
          <Text>pausedTime: {item.pausedTime}</Text>
        </View>
        <View>
          <Text>wage: {item.wage}</Text>
        </View> */}
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
