import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock de alunos
const alunos = [
  { id: '1', name: 'João Silva', age: 12, class: 'Turma A' },
  { id: '2', name: 'Maria Santos', age: 11, class: 'Turma B' },
  { id: '3', name: 'Pedro Oliveira', age: 13, class: 'Turma A' },
];

// Mock de medidas físicas
const medidas = [
  { id: '1', alunoId: '1', data: '2024-06-01', peso: '60', altura: '1.65', circunferenciaBraco: '28', circunferenciaCintura: '70', circunferenciaQuadril: '90' },
  { id: '2', alunoId: '2', data: '2024-06-02', peso: '55', altura: '1.60', circunferenciaBraco: '25', circunferenciaCintura: '68', circunferenciaQuadril: '88' },
];

// Mock de sinais vitais
const sinais = [
  { id: '1', alunoId: '1', data: '2024-06-01', pressaoArterial: '120/80', frequenciaCardiaca: '80', frequenciaRespiratoria: '18' },
  { id: '2', alunoId: '2', data: '2024-06-02', pressaoArterial: '110/70', frequenciaCardiaca: '75', frequenciaRespiratoria: '17' },
];

// Mock de comportamento
const comportamentos = [
  { id: '1', alunoId: '1', data: '2024-06-01', observacao: 'Aluno apresentou bom comportamento.' },
  { id: '2', alunoId: '2', data: '2024-06-02', observacao: 'Aluno disperso em parte da aula.' },
];

export default function RelatoriosScreen() {
  // Exemplo de cálculo de média de peso
  const mediaPeso = medidas.length
    ? (
        medidas.reduce((acc, m) => acc + parseFloat(m.peso), 0) / medidas.length
      ).toFixed(2)
    : '0';

  // Exemplo de cálculo de média de altura
  const mediaAltura = medidas.length
    ? (
        medidas.reduce((acc, m) => acc + parseFloat(m.altura), 0) / medidas.length
      ).toFixed(2)
    : '0';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>

      <View style={styles.card}>
        <Ionicons name="people" size={28} color="#007AFF" />
        <Text style={styles.cardTitle}>Total de Alunos</Text>
        <Text style={styles.cardValue}>{alunos.length}</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="body" size={28} color="#007AFF" />
        <Text style={styles.cardTitle}>Média de Peso</Text>
        <Text style={styles.cardValue}>{mediaPeso} kg</Text>
        <Text style={styles.cardTitle}>Média de Altura</Text>
        <Text style={styles.cardValue}>{mediaAltura} m</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="pulse" size={28} color="#007AFF" />
        <Text style={styles.cardTitle}>Últimos Sinais Vitais</Text>
        {sinais.slice(0, 3).map(s => (
          <Text key={s.id} style={styles.cardDetail}>
            {alunos.find(a => a.id === s.alunoId)?.name || 'Aluno'}: {s.pressaoArterial} mmHg, {s.frequenciaCardiaca} bpm, {s.frequenciaRespiratoria} irpm
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Ionicons name="analytics" size={28} color="#007AFF" />
        <Text style={styles.cardTitle}>Últimas Observações de Comportamento</Text>
        {comportamentos.slice(0, 3).map(c => (
          <Text key={c.id} style={styles.cardDetail}>
            {alunos.find(a => a.id === c.alunoId)?.name || 'Aluno'}: {c.observacao}
          </Text>
        ))}
      </View>

      {/* Aqui você pode adicionar gráficos usando react-native-chart-kit ou outra lib */}
      {/* Exemplo de integração futura com backend:
        useEffect(() => {
          fetch('URL_DO_BACKEND/relatorios').then(...)
        }, []);
      */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  cardValue: {
    fontSize: 22,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDetail: {
    fontSize: 15,
    color: '#444',
    marginTop: 4,
    textAlign: 'center',
  },
}); 