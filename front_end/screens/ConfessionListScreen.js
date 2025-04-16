import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import api from '../utils/api';

export default function ConfessionListScreen({ navigation }) {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConfessions = async () => {
    try {
      const response = await api.get('/confessions/');
      setConfessions(response.data);
    } catch (error) {
      console.error('Error fetching confessions:', error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConfessions();
  }, []);

  const renderConfession = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ConfessionDetail', { confession: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.preview}>{item.body}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading confessions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {confessions.length === 0 ? (
        <View style={styles.center}>
          <Text>No confessions found.</Text>
        </View>
      ) : (
        <FlatList
          data={confessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConfession}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  preview: {
    color: '#555',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

