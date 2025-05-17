import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  const menuItems = [
    {
      title: 'Alunos',
      icon: 'people' as const,
      description: 'Gerenciar cadastros e perfis dos alunos',
      route: '/(tabs)/alunos' as const,
    },
    {
      title: 'Medidas Físicas',
      icon: 'body' as const,
      description: 'Registrar peso, altura e circunferências',
      route: '/(tabs)/medidas' as const,
    },
    {
      title: 'Sinais Vitais',
      icon: 'pulse' as const,
      description: 'Monitorar pressão arterial, frequência cardíaca e respiratória',
      route: '/(tabs)/sinais-vitais' as const,
    },
    {
      title: 'Comportamento',
      icon: 'analytics' as const,
      description: 'Registrar observações comportamentais',
      route: '/(tabs)/comportamento' as const,
    },
    {
      title: 'Relatórios',
      icon: 'bar-chart' as const,
      description: 'Visualizar gráficos e análises',
      route: '/(tabs)/relatorios' as const,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>APAE Araras</Text>
          <Text style={styles.subtitle}>Sistema de Acompanhamento</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon} size={32} color="#007AFF" />
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Bem-vindo ao Sistema</Text>
        <Text style={styles.infoText}>
          Este aplicativo foi desenvolvido para otimizar o acompanhamento dos alunos da APAE de Araras,
          facilitando o registro e monitoramento de dados importantes para o desenvolvimento de cada aluno.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  logoutButton: {
    padding: 8,
    marginLeft: 10,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  menuItem: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
