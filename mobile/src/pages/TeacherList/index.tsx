import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text} from 'react-native';
import { TextInput, BorderlessButton, RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Feather} from '@expo/vector-icons';
import TeacherItem, {Teacher} from '../../components/TeacherItem';
import PageHeader from '../../components/PageHeader';
import api from '../../services/api';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import { response, json } from 'express';

function TeacherList() {
  const [isFiltersVisible, setFiltersVisible] = useState(false);
  
  const [teachers, setTeachers] = useState([]);
  const [week_day, setWeekDay] = useState('');
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {

        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher )=> {
          return teacher.id;
        })

        setFavorites(favoritedTeachersIds);
      }
    });
  }

  function handleToggleFiltersVisible() {
    setFiltersVisible(!isFiltersVisible);
  }

  async function handleFiltersSubmit() {
      loadFavorites();
      
      const response = await api.get('classes', {
        params: {
        subject,
        week_day,
        time,
        }
      });
      setTeachers(response.data);
      handleToggleFiltersVisible();
    }
  useFocusEffect(() => {
    loadFavorites();
  });
  return (
    <View style={styles.container}>
      <PageHeader title="Proffys disponíveis" headerRight={(
        <BorderlessButton onPress={handleToggleFiltersVisible}>
          <Feather name="filter" size={20} color="#FFF"/>
        </BorderlessButton> 
      )}>
        
          { isFiltersVisible && (
            <View style={styles.searchForm}>
              <Text style={styles.label}>Matérias</Text>
              <TextInput
                value={subject}
                onChangeText={text => setSubject(text)}
                style={styles.input}
                placeholder="Qual a matéria?"
                placeholderTextColor='#c1bccc'
              />

              <View style={styles.inputGroup}>
                <View style={styles.inputBlock}>
                  <Text style={styles.label}>Dia da semana</Text>
                  <TextInput 
                  value={week_day}
                    style={styles.input}
                    onChangeText={text => setWeekDay(text)}
                    placeholder="Qual o dia?"
                    placeholderTextColor='#c1bccc'
                  />
                </View>

                <View style={styles.inputBlock}>
                  <Text style={styles.label}>Horário</Text>
                  <TextInput 
                    value={time}
                    style={styles.input}
                    onChangeText={text => setTime(text)}
                    placeholder="Qual o horário?"
                    placeholderTextColor='#c1bccc'
                  />
                </View>
              </View>
              <TouchableOpacity onPress={handleFiltersSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Filtrar</Text>
              </TouchableOpacity>
            </View>
        )}
      </PageHeader>

      <ScrollView 
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 24,
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem 
              key={teacher.id} 
              teacher={teacher} 
              favorited={favorites.includes(teacher.id)}
            />
          
          )
        })}
      </ScrollView>
      
    </View>
  );
}

export default TeacherList;