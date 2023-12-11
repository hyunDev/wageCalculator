import React, {useState, useCallback} from 'react';
import {Text, View} from 'react-native';
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

  return (
    <View>
      <Text>JSON 데이터:</Text>
      <Text>{JSON.stringify(jsonData, null, 2)}</Text>
    </View>
  );
}
