import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Tipos
interface Student {
  _id: string;
  name: string;
  age: number;
  class: string;
  cid: string;
}

interface Medida {
  _id: string;
  alunoId: {
    _id: string;
    name: string;
  };
  data: string;
  peso: number;
  altura: number;
  circunferenciaBraco: number;
  circunferenciaCintura: number;
  circunferenciaQuadril: number;
}

interface SinalVital {
  _id: string;
  alunoId: {
    _id: string;
    name: string;
  };
  data: string;
  pressaoArterial: string;
  frequenciaCardiaca: number;
  frequenciaRespiratoria: number;
}

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

export default function RelatoriosScreen() {
  const [alunos, setAlunos] = useState<Student[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Student | null>(null);
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [sinais, setSinais] = useState<SinalVital[]>([]);
  const [comportamentos, setComportamentos] = useState<Comportamento[]>([]);
  const [loading, setLoading] = useState(true);

  const formatarData = (dataString: string) => {
    const [ano, mes, dia] = dataString.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  useEffect(() => {
    if (selectedAluno) {
      fetchAlunoData(selectedAluno._id);
    }
  }, [selectedAluno]);

  const fetchAlunos = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);
      const data = await response.json();
      setAlunos(data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alunos');
      setLoading(false);
    }
  };

  const fetchAlunoData = async (alunoId: string) => {
    setLoading(true);
    try {
      // Buscar medidas
      const medidasResponse = await fetch(`${API_URL}/medidas/aluno/${alunoId}`);
      const medidasData = await medidasResponse.json();
      setMedidas(medidasData);

      // Buscar sinais vitais
      const sinaisResponse = await fetch(`${API_URL}/sinais-vitais/aluno/${alunoId}`);
      const sinaisData = await sinaisResponse.json();
      setSinais(sinaisData);

      // Buscar comportamentos
      const comportamentosResponse = await fetch(`${API_URL}/comportamentos/aluno/${alunoId}`);
      const comportamentosData = await comportamentosResponse.json();
      setComportamentos(comportamentosData);

      setLoading(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do aluno');
      setLoading(false);
    }
  };

  const renderAlunoCard = ({ item }: { item: Student }) => (
    <TouchableOpacity
      style={[
        styles.alunoCard,
        selectedAluno?._id === item._id && styles.selectedAlunoCard,
      ]}
      onPress={() => setSelectedAluno(item)}
    >
      <Text style={styles.alunoName}>{item.name}</Text>
      <Text style={styles.alunoInfo}>Idade: {item.age} anos</Text>
      <Text style={styles.alunoInfo}>Turma: {item.class}</Text>
      <Text style={styles.alunoInfo}>CID: {item.cid}</Text>
    </TouchableOpacity>
  );

  const renderMedidas = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Medidas Físicas</Text>
      {medidas.length > 0 ? (
        medidas.map(medida => (
          <View key={medida._id} style={styles.recordCard}>
            <Text style={styles.recordDate}>
              Data do registro: {formatarData(medida.data)}
            </Text>
            <Text>Peso: {medida.peso} kg</Text>
            <Text>Altura: {medida.altura} m</Text>
            <Text>Circunferência do Braço: {medida.circunferenciaBraco} cm</Text>
            <Text>Circunferência da Cintura: {medida.circunferenciaCintura} cm</Text>
            <Text>Circunferência do Quadril: {medida.circunferenciaQuadril} cm</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>Nenhuma medida registrada</Text>
      )}
    </View>
  );

  const renderSinaisVitais = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Sinais Vitais</Text>
      {sinais.length > 0 ? (
        sinais.map(sinal => (
          <View key={sinal._id} style={styles.recordCard}>
            <Text style={styles.recordDate}>
              Data do registro: {formatarData(sinal.data)}
            </Text>
            <Text>Pressão Arterial: {sinal.pressaoArterial} mmHg</Text>
            <Text>Frequência Cardíaca: {sinal.frequenciaCardiaca} bpm</Text>
            <Text>Frequência Respiratória: {sinal.frequenciaRespiratoria} irpm</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>Nenhum sinal vital registrado</Text>
      )}
    </View>
  );

  const renderComportamentos = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Comportamentos</Text>
      {comportamentos.length > 0 ? (
        comportamentos.map(comportamento => (
          <View key={comportamento._id} style={styles.recordCard}>
            <Text style={styles.recordDate}>
              Data do registro: {formatarData(comportamento.data)}
            </Text>
            <Text>Observação: {comportamento.observacao}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>Nenhum registro de comportamento</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios por Aluno</Text>
      
      <FlatList
        data={alunos}
        renderItem={renderAlunoCard}
        keyExtractor={item => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.alunosList}
      />

      {selectedAluno ? (
        <ScrollView style={styles.reportContainer}>
          <Text style={styles.selectedAlunoTitle}>
            Relatório de {selectedAluno.name}
          </Text>
          {renderMedidas()}
          {renderSinaisVitais()}
          {renderComportamentos()}
        </ScrollView>
      ) : (
        <View style={styles.noSelectionContainer}>
          <Ionicons name="person" size={64} color="#ccc" />
          <Text style={styles.noSelectionText}>
            Selecione um aluno para ver seu relatório
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    margin: 16,
    textAlign: 'center',
  },
  alunosList: {
    maxHeight: 120,
    paddingHorizontal: 16,
  },
  alunoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginRight: 12,
    width: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedAlunoCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  alunoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  alunoInfo: {
    fontSize: 14,
    color: '#666',
  },
  reportContainer: {
    flex: 1,
    padding: 16,
  },
  selectedAlunoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noSelectionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
}); 