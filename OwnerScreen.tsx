import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { theme } from '../theme';
import { MaintenanceStaffMember, User } from '../types';
import { StatCard } from '../components/SharedComponents';

interface OwnerScreenProps {
  user: User;
  onSignOut: () => void;
}

export const OwnerScreen: React.FC<OwnerScreenProps> = ({ user, onSignOut }) => {
  const [selectedTab, setSelectedTab] = useState<number>(0); // 0: Dashboard, 1: Properties, 2: Bookings, 3: Staff

  const [staffList, setStaffList] = useState<MaintenanceStaffMember[]>([
    { id: 'maint_01', ownerId: user.uid, name: 'Vikram Kumar', email: 'vikram@staynest.com', phone: '+91 9876500001', isApproved: true, assignedPropertyIds: ['prop_1'], createdAt: Date.now() },
    { id: 'maint_02', ownerId: user.uid, name: 'Suresh Tech', email: 'suresh@staynest.com', phone: '+91 9876500002', isApproved: false, assignedPropertyIds: ['prop_1'], createdAt: Date.now() },
  ]);

  const toggleStaffAccess = (id: string) => {
    setStaffList(staffList.map(s => s.id === id ? { ...s, isApproved: !s.isApproved } : s));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Owner Dashboard</Text>
        <TouchableOpacity onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        {selectedTab === 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Metrics</Text>
            <View style={styles.row}>
              <StatCard title="Total Properties" value="2" subtitle="Active PGs" />
              <View style={{ width: 12 }} />
              <StatCard title="Available Rooms" value="9" subtitle="Vacant beds" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <StatCard title="Pending Visits" value="1" subtitle="Scheduled tours" />
              <View style={{ width: 12 }} />
              <StatCard title="Open Tickets" value="1" subtitle="Action needed" />
            </View>
          </View>
        ) : null}

        {selectedTab === 3 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maintenance Staff Team</Text>
            {staffList.map((staff) => (
              <View key={staff.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.cardTitle}>{staff.name}</Text>
                    <Text style={styles.cardDesc}>{staff.email || staff.phone}</Text>
                    <Text style={[styles.statusText, { color: staff.isApproved ? theme.colors.burgundyPrimary : theme.colors.statusRed }]}>
                      {staff.isApproved ? 'Access Approved' : 'Access Revoked / Pending'}
                    </Text>
                  </View>
                  <Switch
                    value={staff.isApproved}
                    onValueChange={() => toggleStaffAccess(staff.id)}
                    trackColor={{ false: theme.colors.iosBorder, true: theme.colors.burgundyPrimary }}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {/* Tab Navigation */}
      <View style={styles.navBar}>
        {[
          { label: 'Dashboard', icon: '📊' },
          { label: 'Properties', icon: '🏢' },
          { label: 'Bookings', icon: '📅' },
          { label: 'Staff', icon: '👥' },
        ].map((tab, idx) => (
          <TouchableOpacity key={tab.label} style={styles.navItem} onPress={() => setSelectedTab(idx)}>
            <Text style={{ fontSize: 20 }}>{tab.icon}</Text>
            <Text style={[styles.navLabel, selectedTab === idx && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.iosBackground },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.iosSurface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.iosBorder,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.burgundyPrimary },
  signOutText: { color: theme.colors.burgundyPrimary, fontWeight: '700' },
  body: { padding: 16 },
  section: { width: '100%' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.burgundyPrimary, marginBottom: 12 },
  row: { flexDirection: 'row' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: {
    backgroundColor: theme.colors.iosSurface,
    borderRadius: theme.borderRadius.large,
    borderColor: theme.colors.iosBorder,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.iosTextPrimary },
  cardDesc: { fontSize: 13, color: theme.colors.iosTextSecondary, marginVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  navBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 70,
    backgroundColor: theme.colors.iosSurface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.iosBorder,
    paddingBottom: 10,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 11, color: theme.colors.iosTextSecondary, marginTop: 2 },
  navLabelActive: { color: theme.colors.burgundyPrimary, fontWeight: '700' }
});
