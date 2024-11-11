import React, { useState, useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth, useUser } from "@clerk/clerk-expo";
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, Animated, Keyboard } from "react-native";
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const [currencies, setCurrencies] = useState([
    { code: 'BRL', name: 'Real (BRL)', flag: 'https://flagcdn.com/w320/br.png' },
    { code: 'USD', name: 'Dólar (USD)', flag: 'https://flagcdn.com/w320/us.png' },
    { code: 'EUR', name: 'Euro (EUR)', flag: 'https://flagcdn.com/w320/eu.png' },
    { code: 'GBP', name: 'Libra (GBP)', flag: 'https://flagcdn.com/w320/gb.png' },
    { code: 'JPY', name: 'Iene (JPY)', flag: 'https://flagcdn.com/w320/jp.png' },
    { code: 'AUD', name: 'Dólar Australiano (AUD)', flag: 'https://flagcdn.com/w320/au.png' },
    { code: 'CAD', name: 'Dólar Canadense (CAD)', flag: 'https://flagcdn.com/w320/ca.png' },
    { code: 'CHF', name: 'Franco Suíço (CHF)', flag: 'https://flagcdn.com/w320/ch.png' },
    { code: 'CNY', name: 'Yuan Chinês (CNY)', flag: 'https://flagcdn.com/w320/cn.png' },
    { code: 'INR', name: 'Rupia Indiana (INR)', flag: 'https://flagcdn.com/w320/in.png' },
    { code: 'MXN', name: 'Peso Mexicano (MXN)', flag: 'https://flagcdn.com/w320/mx.png' },
    { code: 'AED', name: 'Dirham Emiradense (AED)', flag: 'https://flagcdn.com/w320/ae.png' },
    { code: 'ARS', name: 'Peso Argentino (ARS)', flag: 'https://flagcdn.com/w320/ar.png' },
    { code: 'BGN', name: 'Lev Búlgaro (BGN)', flag: 'https://flagcdn.com/w320/bg.png' },
    { code: 'CLP', name: 'Peso Chileno (CLP)', flag: 'https://flagcdn.com/w320/cl.png' },
    { code: 'COP', name: 'Peso Colombiano (COP)', flag: 'https://flagcdn.com/w320/co.png' },
    { code: 'CZK', name: 'Coroa Checa (CZK)', flag: 'https://flagcdn.com/w320/cz.png' },
    { code: 'DKK', name: 'Coroa Dinamark (DKK)', flag: 'https://flagcdn.com/w320/dk.png' },
    { code: 'EGP', name: 'Libra Egípcia (EGP)', flag: 'https://flagcdn.com/w320/eg.png' },
    { code: 'HUF', name: 'Forinte Húngaro (HUF)', flag: 'https://flagcdn.com/w320/hu.png' },
    { code: 'IDR', name: 'Rupia Indonésia (IDR)', flag: 'https://flagcdn.com/w320/id.png' },
    { code: 'ILS', name: 'Shekel Israelense (ILS)', flag: 'https://flagcdn.com/w320/il.png' },
    { code: 'KRW', name: 'Won Sul-coreano (KRW)', flag: 'https://flagcdn.com/w320/kr.png' },
    { code: 'LKR', name: 'Rúpia do Sri Lanka (LKR)', flag: 'https://flagcdn.com/w320/lk.png' },
    { code: 'MYR', name: 'Ringgit Malaio (MYR)', flag: 'https://flagcdn.com/w320/my.png' },
    { code: 'NOK', name: 'Coroa Norueguesa (NOK)', flag: 'https://flagcdn.com/w320/no.png' },
    { code: 'NZD', name: 'Dólar Neozelandês (NZD)', flag: 'https://flagcdn.com/w320/nz.png' },
    { code: 'PHP', name: 'Peso Filipino (PHP)', flag: 'https://flagcdn.com/w320/ph.png' },
    { code: 'PLN', name: 'Zloty Polonês (PLN)', flag: 'https://flagcdn.com/w320/pl.png' },
    { code: 'RON', name: 'Leu Romeno (RON)', flag: 'https://flagcdn.com/w320/ro.png' },
    { code: 'RUB', name: 'Rublos Russos (RUB)', flag: 'https://flagcdn.com/w320/ru.png' },
    { code: 'SAR', name: 'Riyal Saudita (SAR)', flag: 'https://flagcdn.com/w320/sa.png' },
    { code: 'SEK', name: 'Coroa Sueca (SEK)', flag: 'https://flagcdn.com/w320/se.png' },
    { code: 'SGD', name: 'Dólar de Singapura (SGD)', flag: 'https://flagcdn.com/w320/sg.png' },
    { code: 'THB', name: 'Baht Tailandês (THB)', flag: 'https://flagcdn.com/w320/th.png' },
    { code: 'TRY', name: 'Lira Turca (TRY)', flag: 'https://flagcdn.com/w320/tr.png' },
    { code: 'VND', name: 'Dong Vietnamita (VND)', flag: 'https://flagcdn.com/w320/vn.png' },
    { code: 'ZAR', name: 'Rand Sul-Africano (ZAR)', flag: 'https://flagcdn.com/w320/za.png' },
  ]);
  const [searchText, setSearchText] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
  const [amounts, setAmounts] = useState({ BRL: '' });
  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/BRL');
      setRates(response.data.rates);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      Alert.alert('Erro', 'Erro ao obter as cotações.');
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleAmountChange = (currency, value) => {
    const numericValue = value.replace(/[^\d.-]/g, '');
    setAmounts((prevAmounts) => {
      const newAmounts = { ...prevAmounts, [currency]: numericValue };

      Object.keys(rates).forEach((curr) => {
        if (curr !== currency) {
          newAmounts[curr] = ((parseFloat(numericValue) || 0) * rates[curr] / rates[currency]).toFixed(2);
        }
      });

      return newAmounts;
    });
  };


  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredCurrencies(currencies);
    } else {
      const filtered = currencies.filter(currency =>
        currency.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCurrencies(filtered);
    }
  };

  const moveCurrencyUp = (index) => {
    if (index > 0) {
      const newCurrencies = [...currencies];
      // Troca de posição das moedas
      const temp = newCurrencies[index];
      newCurrencies[index] = newCurrencies[index - 1];
      newCurrencies[index - 1] = temp;
      setCurrencies(newCurrencies);
      setFilteredCurrencies(newCurrencies);
    }
  };
  
  const moveCurrencyDown = (index) => {
    if (index < currencies.length - 1) {
      const newCurrencies = [...currencies];
      // Troca de posição das moedas
      const temp = newCurrencies[index];
      newCurrencies[index] = newCurrencies[index + 1];
      newCurrencies[index + 1] = temp;
      setCurrencies(newCurrencies);
      setFilteredCurrencies(newCurrencies);
    }
  };
  
  

  const CurrencyInput = ({ currency, value, index }) => (
    <View style={styles.currencyInput}>
      <Image source={{ uri: currency.flag }} style={styles.flag} />
      <Text style={styles.currencyName}>{currency.name}</Text>
      <TextInput
        style={styles.input}
        value={value}
        keyboardType="numeric"
        placeholder="0.00"
        placeholderTextColor="#aaa"
        textAlign="right"
        onChangeText={(text) => {
          Keyboard.show();
          setAmounts((prevAmounts) => ({
            ...prevAmounts,
            [currency.code]: text,
          }));
        }}
        onEndEditing={(event) => {
          handleAmountChange(currency.code, event.nativeEvent.text);
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => moveCurrencyUp(index)} style={styles.moveButton}>
          <Icon name="arrow-upward" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => moveCurrencyDown(index)} style={styles.moveButton}>
          <Icon name="arrow-downward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrencyTable = () => {
    const tableData = filteredCurrencies.filter(currency => currency.code);
    return (
      <View style={styles.tableContainer}>
        {tableData.map(currency => (
          <View key={currency.code} style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {currency.name}
            </Text>
            <Text style={styles.tableCell2}>
              {rates[currency.code]
                ? `R$ ${(1 / rates[currency.code]).toFixed(2)}`
                : 'Carregando...'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: user?.imageUrl }} style={styles.userImage} />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.spaceBetweenHeaderAndInputs}></View>

        <Text style={{ fontSize: 21, fontWeight: '700', paddingBottom: 20, color: 'white', textAlign: 'center' }}>
          Convert Coin 💰
        </Text>

        <Text style={{ color: 'white', fontSize: 14, textAlign: 'left', marginBottom: 20, paddingLeft: 5 }}>
          Atualizado em: {lastUpdated ? lastUpdated : 'Carregando...'}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar moeda"
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={Keyboard.dismiss} style={styles.searchIconContainer}>
            <Icon name="search" size={25} color="#FF5722" />
          </TouchableOpacity>
        </View>

        <View>
          {filteredCurrencies.map((currency, index) => (
            <CurrencyInput
              key={currency.code} 
              currency={currency}
              value={amounts[currency.code]} 
              index={index}
            />
          ))}
        </View>

        {renderCurrencyTable()}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  flag: {
    width: 24,
    height: 16,
    marginLeft: '5%',
    position: 'absolute',
    zIndex: 1,
  },
  currencyName: {
    color: '#fff',
    fontSize: 16,
    marginLeft: '14%',
    position: 'absolute',
    zIndex: 1,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    width: '73%',
    padding: 12,
    paddingRight: 18,
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
    textAlign: 'right',
  },
  searchInput: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    paddingLeft: 16,
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
    width: '99%',
  },
  searchIconContainer: {
    position: 'absolute',
    left: '90%',

  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  moveButton: {
    backgroundColor: '#ff5722',
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  spaceBetweenHeaderAndInputs: {
    height: 1,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'gray',
  },
  tableContainer: {
    marginTop: 10,
    marginBottom: '20%',
    backgroundColor: '#333',
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  tableCell: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    textAlign: 'left',
  },
  tableCell2: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
});
