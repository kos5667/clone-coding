import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = '60fe1824475d17403affbeb062e52bf5';

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const[city, setCity] = useState("Loading...")
  const[days, setDays] = useState()
  const[ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});

    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps: false}
    );

    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json);
  }
  useEffect(() => {
    getWeather();
  });

  return (
    <View style={styles.container}>
      <StatusBar style='dark'/>

      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      
      <ScrollView 
        pagingEnabled 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        
        { days === undefined ? (
          <View style={styles.day}>
            <ActivityIndicator color={'black'} size={'large'}/>
          </View>
        ) : (
          <View style={styles.day}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <Text style={styles.temp}>{parseFloat(days.main.temp).toFixed(1)}</Text>
              <Ionicons name={icons[days.weather[0].main]} size={68} color="black" />
            </View>
            <Text style={styles.description}>{days.weather[0].main}</Text> 
            <Text style={styles.tinyText}>{days.weather[0].description}</Text> 
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "yellow",
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    fontSize: 58,
    fontWeight: '500',
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    fontWeight: "500",
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    fontWeight: "500",
  },
})
