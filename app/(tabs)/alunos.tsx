import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

// API URL configuration
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api'; // Android Emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:3000/api'; // iOS Simulator
  } else {
    return 'http://localhost:3000/api'; // Web
  }
};

const API_URL = getApiUrl();

// Student type
type Student = {
  _id: string;
  name: string;
  age: number;
  class: string;
};

export default function AlunosScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    class: '',
  });

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) {
        throw new Error('Erro ao carregar alunos');
      }
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setStudents([]);
      Alert.alert('Erro', 'Não foi possível carregar os alunos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    setNewStudent({ name: '', age: '', class: '' });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    // Validação dos campos
    if (!newStudent.name.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome do aluno');
      return;
    }
    if (!newStudent.age.trim()) {
      Alert.alert('Erro', 'Por favor, insira a idade do aluno');
      return;
    }
    if (!newStudent.class.trim()) {
      Alert.alert('Erro', 'Por favor, insira a turma do aluno');
      return;
    }

    const age = parseInt(newStudent.age);
    if (isNaN(age) || age <= 0) {
      Alert.alert('Erro', 'Por favor, insira uma idade válida');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Enviando dados:', {
        name: newStudent.name,
        age: age,
        class: newStudent.class,
      });

      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newStudent.name,
          age: age,
          class: newStudent.class,
        }),
      });

      console.log('Resposta do servidor:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar aluno');
      }

      const addedStudent = await response.json();
      console.log('Aluno adicionado:', addedStudent);

      setStudents(prevStudents => [...prevStudents, addedStudent]);
      setModalVisible(false);
      setNewStudent({ name: '', age: '', class: '' });
      Alert.alert('Sucesso', 'Aluno adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível adicionar o aluno';
      Alert.alert('Erro', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStudent = (student: Student) => {
    // TODO: Implement edit student modal/form
    Alert.alert('Editar Aluno', 'Funcionalidade em desenvolvimento');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStudentItem = ({ item }: { item: Student }) => (
    <TouchableOpacity style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetails}>Idade: {item.age} anos</Text>
        <Text style={styles.studentDetails}>Turma: {item.class}</Text>
      </View>
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => handleEditStudent(item)}
      >
        <Ionicons name="pencil" size={20} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alunos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddStudent}>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar alunos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredStudents}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchStudents}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Carregando alunos...' : 'Nenhum aluno encontrado'}
            </Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !submitting && setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Aluno</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome do aluno"
              value={newStudent.name}
              onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
              editable={!submitting}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Idade"
              value={newStudent.age}
              onChangeText={(text) => setNewStudent({ ...newStudent, age: text })}
              keyboardType="numeric"
              editable={!submitting}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Turma"
              value={newStudent.class}
              onChangeText={(text) => setNewStudent({ ...newStudent, class: text })}
              editable={!submitting}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  if (!submitting) {
                    setModalVisible(false);
                    setNewStudent({ name: '', age: '', class: '' });
                  }
                }}
                disabled={submitting}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.submitButton,
                  submitting && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.buttonText, styles.submitButtonText]}>
                    Adicionar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  editButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#007AFF80',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  submitButtonText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 