import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  ImageBackground,
} from 'react-native';
import { getApiUrl } from '../../utils/api';

import Alunos from './alunos';
import Medidas from './medidas';
import SinaisVitais from './sinais-vitais';
import Comportamento from './comportamento';
import Relatorios from './relatorios';

/**
 * VISUAL REFACTOR NOTES
 * ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
 * • Sidebar: brand‑colored background, clearer active state, smoother expand / collapse.
 * • Home: dashboard‑style hero header + grid of quick‑action cards that mirror the sidebar routes.
 * • Layout: lighter grey content background, bigger rounded cards & subtle shadows.
 * • All functionality & route handling preserved – only presentation changed.
 */

type IconName = keyof typeof Ionicons.glyphMap;
type RoutePath =
  | '/'
  | '/(tabs)/alunos'
  | '/(tabs)/medidas'
  | '/(tabs)/sinais-vitais'
  | '/(tabs)/comportamento'
  | '/(tabs)/relatorios';

export default function HomeScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RoutePath>('/');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalTeachers: 25 // Mantendo este valor fixo por enquanto
  });
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/students`);
      const students = await response.json();
      
      // Conta o número total de alunos
      const totalStudents = students.length;
      
      // Conta o número de turmas únicas
      const uniqueClasses = new Set(students.map((student: any) => student.class));
      const totalClasses = uniqueClasses.size;

      setStats({
        totalStudents,
        totalClasses,
        totalTeachers: 25 // Mantendo este valor fixo por enquanto
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  const menuItems: { title: string; icon: IconName; route: RoutePath }[] = [
    { title: 'Início', icon: 'home', route: '/' },
    { title: 'Alunos', icon: 'people', route: '/(tabs)/alunos' },
    { title: 'Medidas Físicas', icon: 'body', route: '/(tabs)/medidas' },
    { title: 'Sinais Vitais', icon: 'pulse', route: '/(tabs)/sinais-vitais' },
    { title: 'Comportamento', icon: 'analytics', route: '/(tabs)/comportamento' },
    { title: 'Relatórios', icon: 'bar-chart', route: '/(tabs)/relatorios' },
  ];

  /**
   * ───────────── Sidebar ─────────────
   */
  const Sidebar = () => (
    <View
      style={[
        styles.sidebar,
        isMobile && styles.mobileSidebar,
        isExpanded ? styles.expandedSidebar : styles.collapsedSidebar,
      ]}
      onTouchStart={() => !isExpanded && setIsExpanded(true)}
    >
      {/* Logo / Brand */}
      <View style={styles.logoSection}>
        <Ionicons name="school" size={28} color="#fff" />
        {isExpanded && <Text style={styles.logoText}>APAE Araras</Text>}
      </View>

      {/* Primary navigation */}
      {menuItems.map((item) => {
        const active = currentRoute === item.route;
        return (
          <TouchableOpacity
            key={item.route}
            style={[styles.menuItem, active && styles.activeMenuItem]}
            onPress={() => {
              setCurrentRoute(item.route);
              if (isMobile) setIsExpanded(false);
            }}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={active ? '#fff' : '#cbd5e1'}
            />
            {isExpanded && (
              <Text style={[styles.menuText, active && styles.activeMenuText]}>
                {item.title}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#cbd5e1" />
        {isExpanded && <Text style={styles.menuText}>Sair</Text>}
      </TouchableOpacity>

      {/* Expand / collapse trigger (desktop) */}
      {!isMobile && (
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Ionicons
            name={isExpanded ? 'chevron-back' : 'chevron-forward'}
            size={20}
            color="#1e3a8a"
          />
        </TouchableOpacity>
      )}
    </View>
  );

  /**
   * ───────────── Content ─────────────
   */
  const renderContent = () => {
    switch (currentRoute) {
      case '/':
        /** Dashboard */
        const quickActions = menuItems.filter((m) => m.route !== '/');
        return (
          <>
            <View style={styles.headerContainer}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Bem-vindo!</Text>
                <Text style={styles.subtitle}>Sistema de Acompanhamento APAE Araras</Text>
              </View>
              <View style={styles.headerDecoration} />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="people" size={24} color="#4f46e5" />
                <Text style={styles.statNumber}>{stats.totalStudents}</Text>
                <Text style={styles.statLabel}>Alunos</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="calendar" size={24} color="#4f46e5" />
                <Text style={styles.statNumber}>{stats.totalClasses}</Text>
                <Text style={styles.statLabel}>Turmas</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="school" size={24} color="#4f46e5" />
                <Text style={styles.statNumber}>{stats.totalTeachers}</Text>
                <Text style={styles.statLabel}>Professores</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Acesso Rápido</Text>
            <View style={styles.quickGrid}>
              {quickActions.map((action) => (
                <Pressable
                  key={action.route}
                  style={styles.quickCard}
                  onPress={() => setCurrentRoute(action.route)}
                >
                  <View style={styles.quickCardIcon}>
                    <Ionicons name={action.icon} size={28} color="#4f46e5" />
                  </View>
                  <Text style={styles.quickCardText}>{action.title}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <Ionicons name="information-circle" size={24} color="#4f46e5" />
                  <Text style={styles.cardTitle}>Sobre o Sistema</Text>
                </View>
                <Text style={styles.cardDescription}>
                  Este aplicativo otimiza o acompanhamento dos alunos da APAE Araras,
                  facilitando o registro e monitoramento de dados importantes para o
                  desenvolvimento de cada aluno.
                </Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <Ionicons name="rocket" size={24} color="#4f46e5" />
                  <Text style={styles.cardTitle}>Próximos Passos</Text>
                </View>
                <Text style={styles.cardDescription}>
                  Use os atalhos acima ou o menu lateral para navegar pelos registros e
                  relatórios detalhados.
                </Text>
              </View>
            </View>
          </>
        );
      case '/(tabs)/alunos':
        return <Alunos />;
      case '/(tabs)/medidas':
        return <Medidas />;
      case '/(tabs)/sinais-vitais':
        return <SinaisVitais />;
      case '/(tabs)/comportamento':
        return <Comportamento />;
      case '/(tabs)/relatorios':
        return <Relatorios />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar />

      <View style={[styles.contentArea, isMobile && styles.mobileContent]}>
        {isMobile && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Ionicons name="menu" size={24} color="#1e3a8a" />
          </TouchableOpacity>
        )}

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );
}

/**
 * ───────────── Styles ─────────────
 */
const styles = StyleSheet.create({
  /* Layout */
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
  },
  contentArea: {
    flex: 1,
    padding: 24,
  },
  mobileContent: {
    padding: 16,
  },
  scrollContent: {
    flex: 1,
  },
  menuButton: {
    padding: 10,
    marginBottom: 10,
  },

  /* Sidebar */
  sidebar: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 24,
    paddingHorizontal: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  expandedSidebar: {
    width: 220,
  },
  collapsedSidebar: {
    width: 64,
  },
  mobileSidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
  },
  logoSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logoText: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 4,
  },
  menuText: {
    marginLeft: 12,
    color: '#cbd5e1',
    fontSize: 14,
  },
  activeMenuItem: {
    backgroundColor: '#2563eb',
  },
  activeMenuText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 'auto',
  },
  expandButton: {
    position: 'absolute',
    right: -14,
    top: '50%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  /* Header */
  headerContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  headerContent: {
    padding: 20,
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  headerDecoration: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 150,
    height: 150,
    backgroundColor: '#818cf8',
    opacity: 0.2,
    borderRadius: 75,
  },

  /* Stats */
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },

  /* Quick actions */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  quickCardIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },

  /* Info section */
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});
