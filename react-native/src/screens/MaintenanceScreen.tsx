import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { theme } from '../theme';
import { Ticket, TicketPriority, TicketStatus, User } from '../types';
import { StatusBadge, PriorityBadge } from '../components/SharedComponents';

interface MaintenanceScreenProps {
  user: User;
  onSignOut: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ user, onSignOut }) => {
  if (!user.isApproved) {
    return (
      <View style={styles.restrictedContainer}>
        <View style={styles.lockBadge}>
          <Text style={{ fontSize: 36 }}>🔒</Text>
        </View>
        <Text style={styles.restrictedTitle}>Account Approval Pending</Text>
        <Text style={styles.restrictedDesc}>
          Hello {user.name}, your staff account ({user.email || user.phone}) is pending approval by the Property Owner.
        </Text>
        <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut}>
          <Text style={styles.signOutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TICK_1001',
      residentId: 'res_101',
      residentName: 'Rohan Sharma',
      residentPhone: '+91 9876543210',
      propertyId: 'prop_1',
      propertyName: 'StayNest Luxury PG for Men',
      roomNumber: '204',
      issueTitle: 'Water Leakage in Bathroom Tap',
      category: 'Plumbing',
      priority: TicketPriority.HIGH,
      description: 'The bathroom tap is leaking continuously.',
      status: TicketStatus.IN_PROGRESS,
      statusHistory: [],
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 43200000,
    }
  ]);

  const [ticketToUpdate, setTicketToUpdate] = useState<Ticket | null>(null);
  const [updateNote, setUpdateNote] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Maintenance Queue</Text>
        <TouchableOpacity onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Real-time Resident Queue</Text>
        {tickets.map((ticket) => (
          <View key={ticket.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.ticketId}>{ticket.id}</Text>
              <StatusBadge status={ticket.status} />
            </View>
            <Text style={styles.cardTitle}>{ticket.issueTitle}</Text>
            <Text style={styles.cardDesc}>Requester: {ticket.residentName} ({ticket.residentPhone})</Text>
            <Text style={styles.cardDesc}>Property: {ticket.propertyName} (Room {ticket.roomNumber})</Text>
            <View style={[styles.rowBetween, { marginTop: 12 }]}>
              <PriorityBadge priority={ticket.priority} />
              <TouchableOpacity style={styles.updateBtn} onPress={() => setTicketToUpdate(ticket)}>
                <Text style={styles.updateBtnText}>Update Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={!!ticketToUpdate} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Ticket Status</Text>
            <Text style={styles.cardTitle}>{ticketToUpdate?.issueTitle}</Text>
            <TextInput
              style={[styles.input, { height: 80, marginTop: 12 }]}
              placeholder="Status Update Note (e.g. Plumber assigned)"
              multiline
              value={updateNote}
              onChangeText={setUpdateNote}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              {[TicketStatus.IN_PROGRESS, TicketStatus.COMPLETED].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={styles.statusOptionBtn}
                  onPress={() => {
                    if (ticketToUpdate) {
                      setTickets(tickets.map(t => t.id === ticketToUpdate.id ? { ...t, status: st } : t));
                    }
                    setTicketToUpdate(null);
                  }}
                >
                  <Text style={styles.statusOptionText}>{st.replace('_', ' ')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
  sectionTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.burgundyPrimary, marginBottom: 12 },
  card: {
    backgroundColor: theme.colors.iosSurface,
    borderRadius: theme.borderRadius.large,
    borderColor: theme.colors.iosBorder,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketId: { fontWeight: '700', color: theme.colors.burgundyPrimary },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.iosTextPrimary, marginVertical: 4 },
  cardDesc: { fontSize: 13, color: theme.colors.iosTextSecondary },
  updateBtn: { backgroundColor: theme.colors.burgundyPrimary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  updateBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  restrictedContainer: { flex: 1, backgroundColor: theme.colors.iosBackground, padding: 24, justifyContent: 'center', alignItems: 'center' },
  lockBadge: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.statusRedBg, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  restrictedTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.iosTextPrimary, marginBottom: 8, textAlign: 'center' },
  restrictedDesc: { fontSize: 14, color: theme.colors.iosTextSecondary, textAlign: 'center', marginBottom: 24 },
  signOutBtn: { backgroundColor: theme.colors.burgundyPrimary, width: '100%', height: 48, borderRadius: theme.borderRadius.medium, alignItems: 'center', justifyContent: 'center' },
  signOutBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: theme.borderRadius.large, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: theme.colors.burgundyPrimary },
  input: { backgroundColor: '#FFFFFF', borderColor: theme.colors.iosBorder, borderWidth: 1, borderRadius: theme.borderRadius.medium, paddingHorizontal: 14, fontSize: 15 },
  statusOptionBtn: { flex: 0.48, backgroundColor: theme.colors.burgundyPrimary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  statusOptionText: { color: '#FFFFFF', fontWeight: '700' }
});
