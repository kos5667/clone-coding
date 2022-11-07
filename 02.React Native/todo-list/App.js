import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@toDos';
const STORAGE_POS = '@pos';
/* 
1. 위치기억(완료)
2. 완료 여부 삭제 x
3. todo 수정 가능하게.
 */
export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  
  useEffect(() => {
    loadToDos();

    loadPos();
  }, []);

  const travel = () => setPosition(false);
  const work = () => setPosition(true);
  const onChangeText = (payload) => setText(payload)

  const setPosition = async (p) => {
    await AsyncStorage.setItem(STORAGE_POS, JSON.stringify(p));
    setWorking(p);
  }

  const loadPos = async() => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_POS);
      setWorking(JSON.parse(s));
    } catch (error) {
      return
    }
  }

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
    } catch (error) {
      console.log(error);
      return
    }
  }
  
  const addToDo = async() => {
    if (text === '')
      return

    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: {text, work: working},r
    // })
    const newToDos = {...toDos, [Date.now()]: {text, working}};

    setToDos(newToDos);
    await saveToDos(newToDos); 
    setText('');
  }

  const completeToDo = (key, complete) => {
    toDos[key] = {...toDos[key], 'complete' : complete };
    // 이렇게 하면 페이지 로드 안됨...
    // setToDos(toDos);
    // saveToDos(toDos);
    // 이렇게 하면 로드가 바로되는 이유는???....
    const newToDos = {...toDos}
    setToDos(newToDos);
    saveToDos(newToDos);
  }

  const deleteToDo = (key) => {
    Alert.alert('Delete To Do', 'Are you sure?',[
      {text: 'Cancel'},
      {text: 'Sure', onPress: () => {
        const newToDos = {...toDos}
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos); 
      }}
    ])
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color : working ? 'white' : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color : !working ? 'white' : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType={'done'}
        value={text}
        placeholder={working ? 'Add a To Do' : 'Where do you want to go?'} 
        style={styles.input}/>

      <ScrollView>
        {
          Object.keys(toDos).map(key => 
            toDos[key].working === working ? (
              <View key={key} style={{...styles.toDo, backgroundColor : toDos[key].complete ? theme.cmToDoBg : theme.toDoBg}}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>

                <TouchableOpacity onPress={() => completeToDo(key, !toDos[key].complete)}>
                  <Text><Ionicons name="checkmark-done-circle-outline" size={24} color="white" /></Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text><AntDesign name="edit" size={24} color="white" /></Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Text><EvilIcons name="trash" size={24} color="white"/></Text>
                </TouchableOpacity>
              </View>
            ) : null
          )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600',
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  },
  btnBox: {
    flexDirection: 'row',
  }
});
