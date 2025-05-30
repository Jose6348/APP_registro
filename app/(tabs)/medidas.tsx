import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

// Tipo para um aluno
interface Student {
  id: string;
  name: string;
  age: number;
  class: string;
}

// Mock de alunos (igual ao de alunos.tsx)
const alunosMock: Student[] = [
  { id: '1', name: 'João Silva', age: 12, class: 'Turma A' },
  { id: '2', name: 'Maria Santos', age: 11, class: 'Turma B' },
  { id: '3', name: 'Pedro Oliveira', age: 13, class: 'Turma A' },
];

// Tipo para um registro de medidas físicas
interface Medida {
  id: string;
  alunoId: string;
  data: string;
  peso: string;
  altura: string;
  circunferenciaBraco: string;
  circunferenciaCintura: string;
  circunferenciaQuadril: string;
}

export default function MedidasScreen() {
  const router = useRouter();
  const [medidas, setMedidas] = useState<Medida[]>([
    {
      id: '1',
      alunoId: '1',
      data: '2024-06-01',
      peso: '60',
      altura: '1.65',
      circunferenciaBraco: '28',
      circunferenciaCintura: '70',
      circunferenciaQuadril: '90',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Omit<Medida, 'id'>>({
    alunoId: alunosMock[0].id,
    data: '',
    peso: '',
    altura: '',
    circunferenciaBraco: '',
    circunferenciaCintura: '',
    circunferenciaQuadril: '',
  });

  const handleAddMedida = () => {
    setMedidas([
      {
        id: (Math.random() * 100000).toFixed(0),
        ...form,
      },
      ...medidas,
    ]);
    setForm({
      alunoId: alunosMock[0].id,
      data: '',
      peso: '',
      altura: '',
      circunferenciaBraco: '',
      circunferenciaCintura: '',
      circunferenciaQuadril: '',
    });
    setModalVisible(false);
  };

  const getAlunoNome = (alunoId: string) => {
    const aluno = alunosMock.find(a => a.id === alunoId);
    return aluno ? aluno.name : 'Aluno não encontrado';
  };

  const renderMedida = ({ item }: { item: Medida }) => (
    <View style={styles.card}>
      <Text style={styles.cardDate}>Data: {item.data}</Text>
      <Text style={styles.cardAluno}>Aluno: {getAlunoNome(item.alunoId)}</Text>
      <Text>Peso: {item.peso} kg</Text>
      <Text>Altura: {item.altura} m</Text>
      <Text>Circ. Braço: {item.circunferenciaBraco} cm</Text>
      <Text>Circ. Cintura: {item.circunferenciaCintura} cm</Text>
      <Text>Circ. Quadril: {item.circunferenciaQuadril} cm</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Medidas Físicas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={medidas}
        renderItem={renderMedida}
        keyExtractor={item => item.id}
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
            <Text style={styles.modalTitle}>Nova Medida</Text>
            <ScrollView>
              <Text style={styles.label}>Aluno</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.alunoId}
                  onValueChange={value => setForm(f => ({ ...f, alunoId: value }))}
                  style={styles.picker}
                >
                  {alunosMock.map(aluno => (
                    <Picker.Item key={aluno.id} label={aluno.name} value={aluno.id} />
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
                style={styles.input}
                placeholder="Peso (kg)"
                keyboardType="numeric"
                value={form.peso}
                onChangeText={text => setForm(f => ({ ...f, peso: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Altura (m)"
                keyboardType="numeric"
                value={form.altura}
                onChangeText={text => setForm(f => ({ ...f, altura: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Circunferência do Braço (cm)"
                keyboardType="numeric"
                value={form.circunferenciaBraco}
                onChangeText={text => setForm(f => ({ ...f, circunferenciaBraco: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Circunferência da Cintura (cm)"
                keyboardType="numeric"
                value={form.circunferenciaCintura}
                onChangeText={text => setForm(f => ({ ...f, circunferenciaCintura: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Circunferência do Quadril (cm)"
                keyboardType="numeric"
                value={form.circunferenciaQuadril}
                onChangeText={text => setForm(f => ({ ...f, circunferenciaQuadril: text }))}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddMedida}>
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