import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';

export default function SignupScreen({ navigation }) {
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email format').required('Email is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords do not match')
            .required('Please confirm your password'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setErrorMsg('');
          try {
            await api.post('/auth/registration/', {
              email: values.email,
              password1: values.password,
              password2: values.confirmPassword,
            });
            navigation.navigate('Login');
          } catch (error) {
            const err = error.response?.data;
            const message =
              err?.email?.[0] ||
              err?.password1?.[0] ||
              err?.non_field_errors?.[0] ||
              'Signup failed. Please try again.';
            setErrorMsg(message);
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

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <Button title="Sign Up" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex:  1, justifyContent: 'center' },
  header: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  input: { marginBottom: 12, borderWidth: 1, padding: 10, borderRadius: 5 },
  error: { color: 'red', fontSize: 12, marginBottom: 8 },
});
