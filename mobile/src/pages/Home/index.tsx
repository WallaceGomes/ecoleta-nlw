import React, { useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import {
  View,
  ImageBackground,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const Home = () => {
  const navigation = useNavigation();

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf,
      city,
    });
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>
              Seu Marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput
            placeholder="Digite a UF"
            style={styles.input}
            value={uf}
            onChangeText={(text) => setUf(text)}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TextInput
            placeholder="Digite a Cidade"
            style={styles.input}
            value={city}
            onChangeText={(text) => setCity(text)}
            autoCorrect={false}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;
