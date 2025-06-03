import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

// Tipo para um aluno
interface Student {
  _id: string;
  name: string;
  age: number;
  class: string;
}

// Tipo para um registro de comportamento
interface Comportamento {
  _id: string;
  alunoId: {
    _id: string;
    name: string;
  };
  data: string;
  observacao: string;
}

const API_URL = 'http://localhost:3000/api';

export default function ComportamentoScreen() {
  const router = useRouter();
  const [comportamentos, setComportamentos] = useState<Comportamento[]>([]);
  const [alunos, setAlunos] = useState<Student[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Omit<Comportamento, '_id' | 'alunoId'> & { alunoId: string }>({
    alunoId: '',
    data: '',
    observacao: '',
  });

  useEffect(() => {
    fetchAlunos();
    fetchComportamentos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);
      const data = await response.json();
      setAlunos(data);
      if (data.length > 0) {
        setForm(prev => ({ ...prev, alunoId: data[0]._id }));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alunos');
    }
  };

  const fetchComportamentos = async () => {
    try {
      const response = await fetch(`${API_URL}/comportamentos`);
      const data = await response.json();
      setComportamentos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os registros de comportamento');
    }
  };

  const handleAddComportamento = async () => {
    try {
      const response = await fetch(`${API_URL}/comportamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar registro de comportamento');
      }

      const novoComportamento = await response.json();
      setComportamentos([novoComportamento, ...comportamentos]);
      setForm({
        alunoId: alunos[0]?._id || '',
        data: '',
        observacao: '',
      });
      setModalVisible(false);
      Alert.alert('Sucesso', 'Registro de comportamento salvo com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o registro de comportamento');
    }
  };

  const getAlunoNome = (alunoId: { _id: string; name: string }) => {
    return alunoId.name;
  };

  const renderComportamento = ({ item }: { item: Comportamento }) => (
    <View style={styles.card}>
      <Text style={styles.cardDate}>Data: {new Date(item.data).toLocaleDateString()}</Text>
      <Text style={styles.cardAluno}>Aluno: {getAlunoNome(item.alunoId)}</Text>
      <Text style={styles.cardObs}>Observação: {item.observacao}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Comportamento</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={comportamentos}
        renderItem={renderComportamento}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666' }}>Nenhum registro ainda.</Text>}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Observação</Text>
            <ScrollView>
              <Text style={styles.label}>Aluno</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.alunoId}
                  onValueChange={value => setForm(f => ({ ...f, alunoId: value }))}
                  style={styles.picker}
                >
                  {alunos.map(aluno => (
                    <Picker.Item key={aluno._id} label={aluno.name} value={aluno._id} />
                  ))}
                </Picker>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Data (AAAA-MM-DD)"
                value={form.data}
                onChangeText={text => setForm(f => ({ ...f, data: text }))}
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Observação"
                multiline
                value={form.observacao}
                onChangeText={text => setForm(f => ({ ...f, observacao: text }))}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddComportamento}>
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
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
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
    marginLeft: 10,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDate: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007AFF',
  },
  cardAluno: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardObs: {
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  picker: {
    height: 44,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 