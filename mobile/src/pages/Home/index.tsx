import React, { useEffect, useState, ChangeEvent, ChangeEventHandler } from 'react';
import { Feather as Icon} from '@expo/vector-icons';
import { View, Image, StyleSheet, Text, ImageBackground, KeyboardAvoidingView, Platform, NativeSyntheticEvent, TextInputSelectionChangeEventData } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEUFResponse {
  sigla: string;

}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0'); 
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    });
  } 


  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    })
  },[]);

  useEffect(() => {
    if(selectedUf === '0') {
      return;
    }

    let nome;

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`).then(response => {
      const cityNames = response.data.map(city => city.nome);
      setCities(cityNames);
    })
  }, [selectedUf]);

  console.log(selectedUf)
  console.log(selectedCity);

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main} >
        <Image source={require('../../assets/logo.png')} /> 
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description} >Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            style={{...stylePicker}}
            onValueChange={(value) => {
              setSelectedUf(value)
            }}
            value={selectedUf}
            placeholder={{
              label: 'Selecione o estado'
            }}
            items={ufs.map(uf => (
              {
                label: uf, value: uf
              }
            ))}
          >
          </RNPickerSelect>
          
          <RNPickerSelect
            style={{...stylePicker}}
            disabled={selectedUf === ''}
            value={selectedCity}
            onValueChange={(value) => {
              setSelectedCity(value)
            }}
            placeholder={{
              label: 'Selecione a cidade'
            }}
            items={cities.map(city => (
              {
                label: city, value: city
              }
            ))}
          >

          </RNPickerSelect>

        </View>
        
        <View style={styles.footer} >
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon} >
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>

      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const stylePicker = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 26,
    fontSize: 16,
    
  },
  inputAndroid: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 26,
    fontSize: 16, 
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },
  
  description: {
    color: '#6c6c80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    // height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 18,
    paddingTop: 9,
    paddingHorizontal: 26,
    fontSize: 16,
    
    
  },

  input: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 26,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34cb79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;