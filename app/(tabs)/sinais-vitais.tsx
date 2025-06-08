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

// Tipo para um registro de sinais vitais
interface SinalVital {
  _id: string;
  alunoId: {
    _id: string;
    name: string;
  };
  data: string;
  pressaoArterial: string;
  frequenciaCardiaca: string;
  frequenciaRespiratoria: string;
}

const API_URL = 'http://localhost:3000/api';

export default function SinaisVitaisScreen() {
  const router = useRouter();
  const [sinais, setSinais] = useState<SinalVital[]>([]);
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

  const [form, setForm] = useState<Omit<SinalVital, '_id' | 'alunoId'> & { alunoId: string }>({
    alunoId: '',
    data: formatarData(new Date().toISOString()),
    pressaoArterial: '',
    frequenciaCardiaca: '',
    frequenciaRespiratoria: '',
  });

  useEffect(() => {
    fetchAlunos();
    fetchSinais();
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

  const fetchSinais = async () => {
    try {
      const response = await fetch(`${API_URL}/sinais-vitais`);
      const data = await response.json();
      setSinais(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os sinais vitais');
    }
  };

  const handleAddSinal = async () => {
    try {
      const dataFormatada = formatarDataParaAPI(form.data);
      const response = await fetch(`${API_URL}/sinais-vitais`, {
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
        throw new Error('Erro ao salvar sinal vital');
      }

      const novoSinal = await response.json();
      setSinais([novoSinal, ...sinais]);
      setForm({
        alunoId: alunos[0]?._id || '',
        data: formatarData(new Date().toISOString()),
        pressaoArterial: '',
        frequenciaCardiaca: '',
        frequenciaRespiratoria: '',
      });
      setModalVisible(false);
      Alert.alert('Sucesso', 'Sinal vital registrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o sinal vital');
    }
  };

  const toggleAluno = (alunoId: string) => {
    setExpandedAlunos(prev => ({
      ...prev,
      [alunoId]: !prev[alunoId]
    }));
  };

  const getSinaisByAluno = (alunoId: string) => {
    return sinais.filter(sinal => sinal.alunoId._id === alunoId)
      .sort((a, b) => {
        const dataA = new Date(formatarDataParaAPI(formatarData(a.data)));
        const dataB = new Date(formatarDataParaAPI(formatarData(b.data)));
        return dataB.getTime() - dataA.getTime();
      });
  };

  const renderSinalCard = (sinal: SinalVital) => (
    <View style={styles.sinalCard}>
      <Text style={styles.sinalDate}>Data do registro: {formatarData(sinal.data)}</Text>
      <View style={styles.sinalGrid}>
        <View style={styles.sinalItem}>
          <Text style={styles.sinalLabel}>Pressão Arterial</Text>
          <Text style={styles.sinalValue}>{sinal.pressaoArterial} mmHg</Text>
        </View>
        <View style={styles.sinalItem}>
          <Text style={styles.sinalLabel}>Freq. Cardíaca</Text>
          <Text style={styles.sinalValue}>{sinal.frequenciaCardiaca} bpm</Text>
        </View>
        <View style={styles.sinalItem}>
          <Text style={styles.sinalLabel}>Freq. Respiratória</Text>
          <Text style={styles.sinalValue}>{sinal.frequenciaRespiratoria} irpm</Text>
        </View>
      </View>
    </View>
  );

  const renderAlunoAccordion = (aluno: Student) => {
    const alunoSinais = getSinaisByAluno(aluno._id);
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
            {alunoSinais.length > 0 ? (
              alunoSinais.map(sinal => renderSinalCard(sinal))
            ) : (
              <Text style={styles.noSinais}>Nenhum sinal vital registrado</Text>
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
        <Text style={styles.title}>Sinais Vitais</Text>
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
            <Text style={styles.modalTitle}>Novo Registro</Text>
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
                style={styles.input}
                placeholder="Pressão Arterial (mmHg)"
                value={form.pressaoArterial}
                onChangeText={text => setForm(f => ({ ...f, pressaoArterial: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Frequência Cardíaca (bpm)"
                keyboardType="numeric"
                value={form.frequenciaCardiaca}
                onChangeText={text => setForm(f => ({ ...f, frequenciaCardiaca: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Frequência Respiratória (irpm)"
                keyboardType="numeric"
                value={form.frequenciaRespiratoria}
                onChangeText={text => setForm(f => ({ ...f, frequenciaRespiratoria: text }))}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddSinal}>
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
  sinalCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  sinalDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  sinalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sinalItem: {
    width: '48%',
    marginBottom: 8,
  },
  sinalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  sinalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  noSinais: {
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