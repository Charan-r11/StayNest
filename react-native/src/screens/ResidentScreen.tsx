import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { theme } from '../theme';
import { Property, Ticket, TicketPriority, TicketStatus, User, Visit, VisitStatus } from '../types';
import { SearchBarComponent, StatusBadge, PriorityBadge } from '../components/SharedComponents';

interface ResidentScreenProps {
  user: User;
  onUpdateProfile?: (name: string, email: string, phone: string) => void;
  onSignOut: () => void;
}

export const ResidentScreen: React.FC<ResidentScreenProps> = ({ user, onUpdateProfile, onSignOut }) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [savedIds, setSavedIds] = useState<string[]>(['prop_1']);
  const [showRaiseTicketModal, setShowRaiseTicketModal] = useState(false);
  const [showScheduleVisitModal, setShowScheduleVisitModal] = useState<Property | null>(null);
  const [visitToReschedule, setVisitToReschedule] = useState<Visit | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);

  const [visitDate, setVisitDate] = useState('2025-03-12');
  const [visitSlot, setVisitSlot] = useState('11:30 AM');

  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketRoom, setTicketRoom] = useState('204');
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [ticketDesc, setTicketDesc] = useState('');

  const sampleProperties: Property[] = [
    {
      id: 'prop_1',
      ownerId: 'owner_1',
      name: 'StayNest Luxury PG for Men',
      address: '123 MG Road, Sector 15',
      neighbourhood: 'Koramangala',
      city: 'Bengaluru',
      rentMin: 8500,
      rentMax: 16000,
      roomTypes: ['Single', 'Double'],
      availableRoomsCount: 6,
      amenities: ['WiFi', 'AC', 'Food', 'Gym'],
      safetyFeatures: ['CCTV', '24/7 Security'],
      description: 'Modern PG in Koramangala with premium organic food & high-speed WiFi.',
      rating: 4.8,
    },
    {
      id: 'prop_2',
      ownerId: 'owner_1',
      name: 'StayNest Comfort PG for Women',
      address: '45 Park Street, Indiranagar',
      neighbourhood: 'Indiranagar',
      city: 'Bengaluru',
      rentMin: 9000,
      rentMax: 18000,
      roomTypes: ['Single', 'Double'],
      availableRoomsCount: 3,
      amenities: ['WiFi', 'Food', 'Housekeeping'],
      safetyFeatures: ['CCTV', 'Biometric Gate'],
      description: 'Top-tier women accommodation with strict safety and spacious rooms.',
      rating: 4.9,
    }
  ];

  const [visits, setVisits] = useState<Visit[]>([
    {
      id: 'vis_1',
      residentId: user.uid,
      residentName: user.name,
      propertyId: 'prop_1',
      propertyName: 'StayNest Luxury PG for Men',
      date: '2025-03-10',
      timeSlot: '11:30 AM',
      status: VisitStatus.SCHEDULED,
      notes: 'Looking for Single AC room on 2nd floor',
      createdAt: Date.now(),
    }
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TICK_1001',
      residentId: user.uid,
      residentName: user.name,
      residentPhone: user.phone,
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

  const toggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter(item => item !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StayNest</Text>
        <TouchableOpacity onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        {selectedTab === 0 ? (
          <View style={styles.section}>
            <SearchBarComponent query={searchQuery} onQueryChange={setSearchQuery} placeholder="Search neighbourhood or PG..." />
            {sampleProperties.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <TouchableOpacity onPress={() => toggleSave(item.id)}>
                    <Text style={{ fontSize: 20 }}>{savedIds.includes(item.id) ? '🔖' : '📑'}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardAddress}>📍 {item.neighbourhood}, {item.city} • ⭐ {item.rating}</Text>
                <Text style={styles.cardRent}>₹{item.rentMin} - ₹{item.rentMax} / month</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>

                <TouchableOpacity style={styles.visitBtn} onPress={() => setShowScheduleVisitModal(item)}>
                  <Text style={styles.visitBtnText}>📅 Schedule Visit</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : null}

        {selectedTab === 2 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scheduled Visits</Text>
            {visits.map((vis) => (
              <View key={vis.id} style={styles.card}>
                <Text style={styles.cardTitle}>{vis.propertyName}</Text>
                <Text style={styles.cardAddress}>📅 Date: {vis.date} at {vis.timeSlot}</Text>
                <Text style={styles.cardDesc}>Status: {vis.status}</Text>
                {vis.status === VisitStatus.SCHEDULED ? (
                  <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setVisits(visits.map(v => v.id === vis.id ? { ...v, status: VisitStatus.CANCELLED } : v))}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rescheduleBtn} onPress={() => setVisitToReschedule(vis)}>
                      <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {selectedTab === 3 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maintenance Tickets</Text>
            <TouchableOpacity style={styles.raiseBtn} onPress={() => setShowRaiseTicketModal(true)}>
              <Text style={styles.raiseBtnText}>+ Raise Maintenance Ticket</Text>
            </TouchableOpacity>
            {tickets.map((ticket) => (
              <View key={ticket.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.ticketId}>{ticket.id}</Text>
                  <StatusBadge status={ticket.status} />
                </View>
                <Text style={styles.cardTitle}>{ticket.issueTitle}</Text>
                <Text style={styles.cardAddress}>{ticket.propertyName} (Room {ticket.roomNumber})</Text>
                <PriorityBadge priority={ticket.priority} />
              </View>
            ))}
          </View>
        ) : null}

        {selectedTab === 4 ? (
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>Account Profile</Text>
              <TouchableOpacity style={styles.editProfileBtn} onPress={() => setShowEditProfileModal(true)}>
                <Text style={styles.editProfileBtnText}>✏️ Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Name: {user.name}</Text>
              <Text style={styles.cardDesc}>Email: {user.email || 'Not specified'}</Text>
              <Text style={styles.cardDesc}>Phone: {user.phone || 'Not specified'}</Text>
              <Text style={styles.cardRent}>Role: Resident</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.navBar}>
        {[
          { label: 'Discover', icon: '🔍' },
          { label: 'Saved', icon: '🔖' },
          { label: 'Visits', icon: '📅' },
          { label: 'Tickets', icon: '🛠️' },
          { label: 'Profile', icon: '👤' },
        ].map((tab, idx) => (
          <TouchableOpacity key={tab.label} style={styles.navItem} onPress={() => setSelectedTab(idx)}>
            <Text style={{ fontSize: 20 }}>{tab.icon}</Text>
            <Text style={[styles.navLabel, selectedTab === idx && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={showEditProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Account Profile</Text>
            <TextInput style={styles.input} placeholder="Full Name" value={editName} onChangeText={setEditName} />
            <TextInput style={styles.input} placeholder="Email Address" value={editEmail} onChangeText={setEditEmail} />
            <TextInput style={styles.input} placeholder="Phone Number" value={editPhone} onChangeText={setEditPhone} />
            <TouchableOpacity style={styles.submitBtn} onPress={() => {
              if (onUpdateProfile) onUpdateProfile(editName, editEmail, editPhone);
              user.name = editName;
              user.email = editEmail;
              user.phone = editPhone;
              setShowEditProfileModal(false);
            }}>
              <Text style={styles.submitBtnText}>Save Profile Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showRaiseTicketModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Raise Maintenance Ticket</Text>
            <TextInput style={styles.input} placeholder="Room Number" value={ticketRoom} onChangeText={setTicketRoom} />
            <TextInput style={styles.input} placeholder="Issue Title" value={ticketTitle} onChangeText={setTicketTitle} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Detailed Description" multiline value={ticketDesc} onChangeText={setTicketDesc} />
            <TouchableOpacity style={styles.submitBtn} onPress={() => {
              const newTicket: Ticket = {
                id: `TICK_${Math.floor(Math.random()*9000)+1000}`,
                residentId: user.uid,
                residentName: user.name,
                residentPhone: user.phone,
                propertyId: 'prop_1',
                propertyName: 'StayNest PG',
                roomNumber: ticketRoom,
                issueTitle: ticketTitle,
                category: 'General',
                priority: ticketPriority,
                description: ticketDesc,
                status: TicketStatus.OPEN,
                statusHistory: [],
                createdAt: Date.now(),
                updatedAt: Date.now()
              };
              setTickets([newTicket, ...tickets]);
              setShowRaiseTicketModal(false);
            }}>
              <Text style={styles.submitBtnText}>Submit Request</Text>
            </TouchableOpacity>
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
  section: { width: '100%' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.burgundyPrimary, marginBottom: 12 },
  card: {
    backgroundColor: theme.colors.iosSurface,
    borderRadius: theme.borderRadius.large,
    borderColor: theme.colors.iosBorder,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.iosTextPrimary },
  cardAddress: { fontSize: 13, color: theme.colors.iosTextSecondary, marginVertical: 4 },
  cardRent: { fontSize: 15, fontWeight: '800', color: theme.colors.burgundyPrimary, marginVertical: 4 },
  cardDesc: { fontSize: 13, color: theme.colors.iosTextSecondary },
  visitBtn: { backgroundColor: theme.colors.burgundyPrimary, paddingVertical: 10, borderRadius: theme.borderRadius.medium, alignItems: 'center', marginTop: 12 },
  visitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  cancelBtn: { borderColor: theme.colors.statusRed, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  cancelBtnText: { color: theme.colors.statusRed, fontWeight: '700' },
  rescheduleBtn: { backgroundColor: theme.colors.burgundyPrimary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  rescheduleBtnText: { color: '#FFFFFF', fontWeight: '700' },
  raiseBtn: { backgroundColor: theme.colors.burgundyPrimary, padding: 14, borderRadius: theme.borderRadius.medium, alignItems: 'center', marginBottom: 16 },
  raiseBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  editProfileBtn: { borderColor: theme.colors.burgundyPrimary, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editProfileBtnText: { color: theme.colors.burgundyPrimary, fontWeight: '700', fontSize: 12 },
  ticketId: { fontWeight: '700', color: theme.colors.burgundyPrimary },
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
  navLabelActive: { color: theme.colors.burgundyPrimary, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: theme.borderRadius.large, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: theme.colors.burgundyPrimary },
  input: { backgroundColor: '#FFFFFF', borderColor: theme.colors.iosBorder, borderWidth: 1, borderRadius: theme.borderRadius.medium, paddingHorizontal: 14, height: 48, fontSize: 15, marginBottom: 12 },
  submitBtn: { backgroundColor: theme.colors.burgundyPrimary, height: 48, borderRadius: theme.borderRadius.medium, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 }
});
