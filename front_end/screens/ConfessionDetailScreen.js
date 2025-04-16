import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

export default function ConfessionDetailScreen({ route }) {
  const { confession } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await api.get('/api/comments/');
      const confessionComments = response.data.filter(
        comment => comment.confession === confession.id
      );
      setComments(confessionComments);
    } catch (error) {
      console.error('Error fetching comments:', error.response?.data || error.message);
      Alert.alert('Error', 'Could not load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments
    try {
      const token = await AsyncStorage.getItem('access');
      await api.post(
        '/api/comments/',
        {
          confession: confession.id,
          text: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error.response?.data || error.message);
      Alert.alert('Error', 'Could not post comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const renderComment = ({ item }) => (
    <Text style={styles.comment}>• {item.text}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{confession.title}</Text>
      <Text style={styles.body}>{confession.body}</Text>

      <Text style={styles.subheading}>Comments:</Text>
      
      {loadingComments ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={comments}
          keyExtractor={item => item.id.toString()}
          renderItem={renderComment}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        value={newComment}
        onChangeText={setNewComment}
      />
      <View style={styles.buttonsContainer}>
        <Button title="Post Comment" onPress={submitComment} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f7f7f7' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  body: { fontSize: 16, marginBottom: 20, color: '#555' },
  subheading: { fontSize: 18, fontWeight: '600', marginTop: 10, marginBottom: 5, color: '#333' },
  input: { 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 10, 
    marginTop: 10, 
    marginBottom: 10, 
    backgroundColor: '#fff', 
    color: '#333'
  },
  comment: { 
    marginBottom: 8, 
    fontSize: 15, 
    color: '#555',
    lineHeight: 20 
  },
  buttonsContainer: { marginTop: 10 },
});
