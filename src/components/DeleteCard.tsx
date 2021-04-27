import React from 'react';
import { 
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { SvgFromUri } from 'react-native-svg';

import colors from '../styles/colors';

interface CardProps extends RectButtonProps {
  data: {
    name: string;
    photo: string;
  }
}

export const DeleteCart = ({ data, ...rest }: CardProps) => {
  return (
    <View style={styles.container}>
      <SvgFromUri uri={data.photo} width={70} height={70}/>
      <Text style={styles.text}>Deseja mesmo deletar sua</Text>
      <Text style={styles.titlePlant}>{`${data.name}`}</Text>

      <View style={styles.buttonContainer}>
        <RectButton>
          <Text style={styles.buttonText}>Cancelar</Text>
        </RectButton>

        <RectButton>
          <Text style={[styles.buttonText, { color: colors.red }]}>Deletar</Text>
        </RectButton>
      </View>
    </View>  
  )
}

const styles = StyleSheet.create({
  container: {

  },

  text: {

  },

  titlePlant: {

  },

  buttonContainer: {
    flexDirection: 'row',
  },

  buttonText: {}
})