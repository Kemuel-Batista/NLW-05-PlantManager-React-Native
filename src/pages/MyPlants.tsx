import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Modal
} from 'react-native';
import { Header } from '../components/Header';

import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';
import { SvgFromUri } from 'react-native-svg';

export function MyPlants(){
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState<string>();

  const [loadPageDelete, setLoadPageDelete] = useState(false);
  const [loadedPlants, setLoadedPlants] = useState<PlantProps>(Object || undefined);

  useEffect(() => {
    async function loadStoragedData(){
      const plantsStoraged = await loadPlant();

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      )

      setNextWaterd(
        `Não esqueça de regar a ${plantsStoraged[0].name} daqui a ${nextTime}`
      )

      setMyPlants(plantsStoraged);
      setLoading(false);
    }

    loadStoragedData();
  }, [])

  async function handleRemove(plant: PlantProps){
    try {
      await removePlant(plant.id)

      setMyPlants((oldData) => 
        oldData.filter((item) => item.id !== plant.id)
      )

      setLoadPageDelete(false);

    } catch (error) {
        Alert.alert('Não foi possível remover!!')
    }
  }

  function handleShowCardDelete(plant: PlantProps){
    setLoadPageDelete(true)
    setLoadedPlants(plant);
  }

  function handleHideCardDelete(){
    setLoadPageDelete(false)
  }

  if(loading)
    return <Load />
    
  return (
    <View style={[styles.container, loadPageDelete && styles.shadowCard]}>
      <Header />

      <View style={[styles.spotLight, loadPageDelete && styles.shadowCard]}>
        <Image source={waterdrop} style={styles.spotLightImage} />
        <Text style={styles.spotLightText}>{nextWaterd}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList 
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary 
              data={item} 
              //handleRemove={() => {handleRemove(item)}}
              handleCard={() => handleShowCardDelete(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {
        loadPageDelete && (
          <View 
            style={styles.containerCardDelete}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <SvgFromUri 
                uri={loadedPlants.photo}
                width={120} height={120}
                style={{ backgroundColor: colors.shape, borderRadius: 20 }}
              />
              <Text style={styles.text}>Deseja mesmo deletar sua</Text>
              <Text style={styles.titlePlant}>{`${loadedPlants.name}?`}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <RectButton style={styles.button} onPress={handleHideCardDelete}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </RectButton>

              <RectButton style={styles.button} onPress={() => handleRemove(loadedPlants)}>
                <Text style={[styles.buttonText, { color: colors.red }]}>Deletar</Text>
              </RectButton>
            </View>
          </View>  
        )
      }

    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: colors.background
  },

  spotLight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  spotLightImage: {
    width: 60,
    height: 60
  },

  spotLightText: {
    color: colors.blue,
    flex: 1,
    paddingHorizontal: 20,
  },

  plants: {
    flex: 1,
    width: '100%'
  },

  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },

  containerCardDelete: {
    position: 'absolute',
    top: '35%',
    flex: 1,
    height: 350,
    width: 270,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
  },

  text: {
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 18,
    marginTop: 20,
  },

  titlePlant: {
    fontFamily: fonts.heading,
    color: colors.heading,
    fontSize: 18
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 20,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 96,
    borderRadius: 12,
    backgroundColor: colors.shape
  },

  buttonText: {
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 16,
  },

  shadowCard: {
    backgroundColor: '#666666'
  }
});