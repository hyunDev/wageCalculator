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
          // console.log(parsedData);
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

  const DATA = [
    {
      id: '1',
      title: 'First Item',
    },
    {
      id: '2',
      title: 'Second Item',
    },
    {
      id: '3',
      title: 'Third Item',
    },
    {
      id: '4',
      title: 'Forth Item',
    },
    {
      id: '5',
      title: 'Fifth Item',
    },
    {
      id: '6',
      title: 'Sixth Item',
    },
    {
      id: '7',
      title: 'Seventh Item',
    },
    {
      id: '8',
      title: 'Eighth Item',
    },
    {
      id: '9',
      title: 'Ninth Item',
    },
    {
      id: '10',
      title: 'Tenth Item',
    },
  ];

  type ItemProps = {title: string};

  // eslint-disable-next-line react/no-unstable-nested-components
  const Item = ({title}: ItemProps) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

  return (
    <FlatList
      data={DATA}
      renderItem={({item}) => <Item title={item.title} />}
      keyExtractor={item => item.id}
    />
  );
}
