import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

export default function HomeScreen({ navigation }) {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConfessions = async () => {
    try {
      const response = await api.get('/confessions/');
      setConfessions(response.data);
    } catch (error) {
      console.error('Failed to load confessions:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
    navigation.replace('Login');
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading confessions...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.confessionCard} onPress={() => navigation.navigate('ConfessionDetail', { id: item.id })}>
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2}>{item.body}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={confessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.header}>🔥 Latest Confessions</Text>}
      />
      <Button title="Logout" onPress={handleLogout} color="#c00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  confessionCard: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});

<Button title="View Confessions" onPress={() => navigation.navigate('ConfessionList')} />