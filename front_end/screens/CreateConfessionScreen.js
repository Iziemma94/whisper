import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Make sure to install this if not yet
import api from '../utils/api';

export default function CreateConfessionScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.log('Category load error:', err.response?.data))
      .finally(() => setLoadingCategories(false));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!body.trim()) newErrors.body = 'Body is required';
    if (!categoryId) newErrors.category = 'Category must be selected';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await api.post('/confessions/', {
        title,
        body,
        category_id: categoryId,
      });
      Alert.alert('Success', 'Confession posted!');
      navigation.navigate('Home');
    } catch (error) {
      console.log('Confession error:', error.response?.data);
      Alert.alert('Error', 'Could not post confession');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setErrors((prev) => ({ ...prev, title: null }));
        }}
      />
      {errors.title && <Text style={styles.error}>{errors.title}</Text>}

      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Confession..."
        value={body}
        multiline
        onChangeText={(text) => {
          setBody(text);
          setErrors((prev) => ({ ...prev, body: null }));
        }}
      />
      {errors.body && <Text style={styles.error}>{errors.body}</Text>}

      {loadingCategories ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <>
          <Picker
            selectedValue={categoryId}
            onValueChange={(itemValue) => {
              setCategoryId(itemValue);
              setErrors((prev) => ({ ...prev, category: null }));
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select category" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
          {errors.category && <Text style={styles.error}>{errors.category}</Text>}
        </>
      )}

      <Button title="Post Confession" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 5, borderColor: '#ccc', color: '#000' },
  picker: { borderWidth: 1, marginBottom: 12, borderColor: '#ccc' },
  error: { color: 'red', fontSize: 12, marginBottom: 8 },
});
