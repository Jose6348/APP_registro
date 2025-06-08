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
        const quickActions = menuItems.filter((m) => m.route !== '/');
        return (
          <>
            <View style={styles.headerContainer}>
              <View style={styles.headerBackground}>
                <View style={styles.headerContent}>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Bem-vindo!</Text>
                    <Text style={styles.subtitle}>Sistema de Acompanhamento APAE Araras</Text>
                  </View>
                  <View style={styles.headerStats}>
                    <View style={styles.headerStat}>
                      <Text style={styles.headerStatNumber}>{stats.totalStudents}</Text>
                      <Text style={styles.headerStatLabel}>Alunos</Text>
                    </View>
                    <View style={styles.headerStatDivider} />
                    <View style={styles.headerStat}>
                      <Text style={styles.headerStatNumber}>{stats.totalClasses}</Text>
                      <Text style={styles.headerStatLabel}>Turmas</Text>
                    </View>
                    <View style={styles.headerStatDivider} />
                    <View style={styles.headerStat}>
                      <Text style={styles.headerStatNumber}>{stats.totalTeachers}</Text>
                      <Text style={styles.headerStatLabel}>Professores</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.mainContent}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acesso Rápido</Text>
                <View style={styles.quickGrid}>
                  {quickActions.map((action) => (
                    <Pressable
                      key={action.route}
                      style={({ pressed }) => [
                        styles.quickCard,
                        pressed && styles.quickCardPressed
                      ]}
                      onPress={() => setCurrentRoute(action.route)}
                    >
                      <View style={[styles.quickCardIcon, { backgroundColor: getIconColor(action.icon) }]}>
                        <Ionicons name={action.icon} size={28} color="#fff" />
                      </View>
                      <Text style={styles.quickCardText}>{action.title}</Text>
                      <Text style={styles.quickCardDescription}>
                        {getActionDescription(action.title)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Visão Geral</Text>
                <View style={styles.overviewGrid}>
                  <View style={styles.overviewCard}>
                    <View style={styles.overviewCardHeader}>
                      <Ionicons name="trending-up" size={24} color="#4f46e5" />
                      <Text style={styles.overviewCardTitle}>Atividade Recente</Text>
                    </View>
                    <View style={styles.activityList}>
                      <View style={styles.activityItem}>
                        <View style={styles.activityIcon}>
                          <Ionicons name="body" size={16} color="#4f46e5" />
                        </View>
                        <Text style={styles.activityText}>Novas medidas registradas</Text>
                        <Text style={styles.activityTime}>2h atrás</Text>
                      </View>
                      <View style={styles.activityItem}>
                        <View style={styles.activityIcon}>
                          <Ionicons name="pulse" size={16} color="#4f46e5" />
                        </View>
                        <Text style={styles.activityText}>Sinais vitais atualizados</Text>
                        <Text style={styles.activityTime}>4h atrás</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.overviewCard}>
                    <View style={styles.overviewCardHeader}>
                      <Ionicons name="information-circle" size={24} color="#4f46e5" />
                      <Text style={styles.overviewCardTitle}>Informações</Text>
                    </View>
                    <Text style={styles.overviewCardDescription}>
                      Este aplicativo otimiza o acompanhamento dos alunos da APAE Araras,
                      facilitando o registro e monitoramento de dados importantes para o
                      desenvolvimento de cada aluno.
                    </Text>
                  </View>
                </View>
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

  const getIconColor = (icon: IconName) => {
    const colors: { [key: string]: string } = {
      people: '#4f46e5',
      body: '#7c3aed',
      pulse: '#db2777',
      analytics: '#059669',
      'bar-chart': '#d97706',
    };
    return colors[icon] || '#4f46e5';
  };

  const getActionDescription = (title: string) => {
    const descriptions: { [key: string]: string } = {
      'Alunos': 'Gerenciar cadastros e informações',
      'Medidas Físicas': 'Registrar medidas corporais',
      'Sinais Vitais': 'Monitorar saúde dos alunos',
      'Comportamento': 'Acompanhar desenvolvimento',
      'Relatórios': 'Visualizar dados e estatísticas',
    };
    return descriptions[title] || '';
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
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerBackground: {
    width: '100%',
    height: 200,
    backgroundColor: '#4f46e5',
  },
  headerContent: {
    flex: 1,
    padding: 24,
  },
  headerTextContainer: {
    marginBottom: 24,
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
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  headerStat: {
    flex: 1,
    alignItems: 'center',
  },
  headerStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStatLabel: {
    fontSize: 12,
    color: '#e0e7ff',
    marginTop: 4,
  },
  headerStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },

  mainContent: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
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
  quickCardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#f8fafc',
  },
  quickCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  quickCardDescription: {
    fontSize: 12,
    color: '#64748b',
  },

  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  overviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  overviewCardDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
});
