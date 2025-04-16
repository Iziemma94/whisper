import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

export default function LoginScreen({ navigation }) {
  const [loginError, setLoginError] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Email is required'),
          password: Yup.string().required('Password is required'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setLoginError('');
          try {
            const response = await api.post('/auth/login/', {
              email: values.email,
              password: values.password,
            });

            const { access, refresh } = response.data;
            await AsyncStorage.setItem('access', access);
            await AsyncStorage.setItem('refresh', refresh);

            navigation.navigate('Home');
          } catch (error) {
            const msg =
              error.response?.data?.non_field_errors?.[0] ||
              error.response?.data?.detail ||
              'Invalid email or password';
            setLoginError(msg);
            console.log('Login error:', error.response?.data);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            {loginError ? <Text style={styles.error}>{loginError}</Text> : null}

            <Button title="Login" onPress={handleSubmit} />
            <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
              No account? Sign up
            </Text>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center', backgroundColor: '#ffffff' },
  header: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', textAlign: 'center', color: '#000' },
  input: { marginBottom: 12, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: '#ccc', color: '#000' },
  error: { color: 'red', fontSize: 12, marginBottom: 8 },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
});
