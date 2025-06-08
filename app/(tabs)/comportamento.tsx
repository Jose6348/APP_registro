import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { getApiUrl } from '../../utils/api';

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
  const [expandedAlunos, setExpandedAlunos] = useState<{ [key: string]: boolean }>({});
  const formatarData = (dataString: string) => {
    const [ano, mes, dia] = dataString.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarDataParaAPI = (dataString: string) => {
    const [dia, mes, ano] = dataString.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const [form, setForm] = useState<Omit<Comportamento, '_id' | 'alunoId'> & { alunoId: string }>({
    alunoId: '',
    data: formatarData(new Date().toISOString()),
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
      const dataFormatada = formatarDataParaAPI(form.data);
      const response = await fetch(`${API_URL}/comportamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          data: dataFormatada
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar registro de comportamento');
      }

      const novoComportamento = await response.json();
      setComportamentos([novoComportamento, ...comportamentos]);
      setForm({
        alunoId: alunos[0]?._id || '',
        data: formatarData(new Date().toISOString()),
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

  const toggleAluno = (alunoId: string) => {
    setExpandedAlunos(prev => ({
      ...prev,
      [alunoId]: !prev[alunoId]
    }));
  };

  const getComportamentosByAluno = (alunoId: string) => {
    return comportamentos.filter(comportamento => comportamento.alunoId._id === alunoId)
      .sort((a, b) => {
        const dataA = new Date(formatarDataParaAPI(formatarData(a.data)));
        const dataB = new Date(formatarDataParaAPI(formatarData(b.data)));
        return dataB.getTime() - dataA.getTime();
      });
  };

  const renderComportamentoCard = (comportamento: Comportamento) => (
    <View style={styles.comportamentoCard}>
      <Text style={styles.comportamentoDate}>
        Data do registro: {formatarData(comportamento.data)}
      </Text>
      <Text style={styles.comportamentoObs}>
        {comportamento.observacao}
      </Text>
    </View>
  );

  const renderAlunoAccordion = (aluno: Student) => {
    const alunoComportamentos = getComportamentosByAluno(aluno._id);
    const isExpanded = expandedAlunos[aluno._id];

    return (
      <View key={aluno._id} style={styles.alunoAccordion}>
        <TouchableOpacity
          style={styles.alunoHeader}
          onPress={() => toggleAluno(aluno._id)}
        >
          <View style={styles.alunoHeaderContent}>
            <Text style={styles.alunoName}>{aluno.name}</Text>
            <Text style={styles.alunoClass}>Turma: {aluno.class}</Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.alunoContent}>
            {alunoComportamentos.length > 0 ? (
              alunoComportamentos.map(comportamento => renderComportamentoCard(comportamento))
            ) : (
              <Text style={styles.noComportamentos}>Nenhum registro de comportamento</Text>
            )}
          </View>
        )}
      </View>
    );
  };

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

      <ScrollView style={styles.content}>
        {alunos.map(aluno => renderAlunoAccordion(aluno))}
      </ScrollView>

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
                placeholder="Data (DD/MM/AAAA)"
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
  content: {
    flex: 1,
    padding: 15,
  },
  alunoAccordion: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alunoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  alunoHeaderContent: {
    flex: 1,
  },
  alunoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  alunoClass: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  alunoContent: {
    padding: 15,
    backgroundColor: '#fff',
  },
  comportamentoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  comportamentoDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  comportamentoObs: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noComportamentos: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 10,
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