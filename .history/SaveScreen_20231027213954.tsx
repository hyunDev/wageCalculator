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
        })
        .catch(error => {
          console.error('파일 읽기 오류:', error);
        });
    }, []),
  );
  /*  type ItemProps = {title: string};

  // eslint-disable-next-line react/no-unstable-nested-components
  const Item = ({title}: ItemProps) => (
    <View>
      <Text>{title}</Text>
    </View>
  );
  return (
    <View>
      <FlatList
        data={Object.entries(jsonData)} // JSON 데이터를 [key, value] 배열로 변환
        keyExtractor={item => item[0]} // 각 항목의 고유 키 설정
        renderItem={({item}) => <Item title={item['startDate']} />}
      />
    </View>
  ); */

  // type ItemProps = {title: string};
  type ItemProps = {
    startDate: string;
    /* endDate: string;
    pausedTime: number;
    wage: Float32Array; */
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const Item = ({startDate}: ItemProps) => (
    <View>
      <Text>{startDate}</Text>
    </View>
  );

  return (
    <FlatList
      data={Object.entries(jsonData)}
      renderItem={({item}) => <Item startDate={item.startDate} />}
      keyExtractor={item => item.id}
    />
  );
}
