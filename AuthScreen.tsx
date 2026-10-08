import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { theme } from '../theme';
import { UserRole } from '../types';

interface AuthScreenProps {
  onSelectRoleDemo: (role: UserRole) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSelectRoleDemo }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.RESIDENT);
  const [tabIndex, setTabIndex] = useState<number>(0); // 0: Sign In, 1: Sign Up

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App Logo */}
      <View style={styles.logoBadge}>
        <Text style={{ fontSize: 36 }}>🏡</Text>
      </View>

      <Text style={styles.appTitle}>StayNest</Text>
      <Text style={styles.appSubtitle}>Accommodation & PG Management</Text>

      {/* Role Switcher */}
      <View style={styles.segmentedContainer}>
        {[UserRole.RESIDENT, UserRole.PROPERTY_OWNER, UserRole.MAINTENANCE_STAFF].map((role) => {
          const isSelected = selectedRole === role;
          const label = role === UserRole.RESIDENT ? 'Resident' : role === UserRole.PROPERTY_OWNER ? 'Owner' : 'Staff';
          return (
            <TouchableOpacity
              key={role}
              style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={[styles.segmentText, isSelected && styles.segmentTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sign In / Sign Up Segment */}
      <View style={[styles.segmentedContainer, { marginTop: 12 }]}>
        {['Sign In', 'Sign Up'].map((title, idx) => {
          const isSelected = tabIndex === idx;
          return (
            <TouchableOpacity
              key={title}
              style={[styles.segmentBtn, isSelected && styles.segmentBtnPrimaryActive]}
              onPress={() => setTabIndex(idx)}
            >
              <Text style={[styles.segmentText, isSelected && styles.segmentTextWhite]}>{title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {tabIndex === 1 ? (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.colors.iosTextSecondary}
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={theme.colors.iosTextSecondary}
        />

        {tabIndex === 1 ? (
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor={theme.colors.iosTextSecondary}
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={theme.colors.iosTextSecondary}
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => onSelectRoleDemo(selectedRole)}
        >
          <Text style={styles.submitBtnText}>{tabIndex === 0 ? 'Sign In' : 'Create Account'}</Text>
        </TouchableOpacity>

        {/* OTP Methods */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.outlinedBtn} onPress={() => setShowPhoneModal(true)}>
            <Text style={styles.outlinedBtnText}>📱 Phone Auth</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlinedBtn} onPress={() => setShowEmailOtpModal(true)}>
            <Text style={styles.outlinedBtnText}>✉️ Email OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Role Switcher */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>Quick Demo Role Switcher</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => onSelectRoleDemo(UserRole.RESIDENT)}>
              <Text style={styles.demoBtnText}>Resident</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSelectRoleDemo(UserRole.PROPERTY_OWNER)}>
              <Text style={styles.demoBtnText}>Owner</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSelectRoleDemo(UserRole.MAINTENANCE_STAFF)}>
              <Text style={styles.demoBtnText}>Staff</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Phone Modal */}
      <Modal visible={showPhoneModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Phone Number Sign In</Text>
            <TextInput style={styles.input} placeholder="Phone Number (+91...)" value={phone} onChangeText={setPhone} />
            <TextInput style={styles.input} placeholder="6-Digit OTP Code" value={otpCode} onChangeText={setOtpCode} />
            <TouchableOpacity style={styles.submitBtn} onPress={() => { setShowPhoneModal(false); onSelectRoleDemo(selectedRole); }}>
              <Text style={styles.submitBtnText}>Verify OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Email OTP Modal */}
      <Modal visible={showEmailOtpModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Email OTP Sign In</Text>
            <TextInput style={styles.input} placeholder="Email Address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="6-Digit Email OTP" value={otpCode} onChangeText={setOtpCode} />
            <TouchableOpacity style={styles.submitBtn} onPress={() => { setShowEmailOtpModal(false); onSelectRoleDemo(selectedRole); }}>
              <Text style={styles.submitBtnText}>Verify Email OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.iosBackground },
  content: { padding: 24, alignItems: 'center' },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: theme.borderRadius.xlarge,
    backgroundColor: theme.colors.burgundyPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  appTitle: { fontSize: 28, fontWeight: '800', color: theme.colors.burgundyPrimary },
  appSubtitle: { fontSize: 13, color: theme.colors.iosTextSecondary, marginBottom: 24 },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.iosSearchBg,
    borderRadius: theme.borderRadius.medium,
    padding: 4,
    width: '100%',
  },
  segmentBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  segmentBtnActive: { backgroundColor: '#FFFFFF' },
  segmentBtnPrimaryActive: { backgroundColor: theme.colors.burgundyPrimary },
  segmentText: { fontSize: 13, color: theme.colors.iosTextSecondary },
  segmentTextActive: { color: theme.colors.burgundyPrimary, fontWeight: '700' },
  segmentTextWhite: { color: '#FFFFFF', fontWeight: '700' },
  formContainer: { width: '100%', marginTop: 24 },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: theme.colors.iosBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    marginBottom: 12,
    color: theme.colors.iosTextPrimary,
  },
  submitBtn: {
    backgroundColor: theme.colors.burgundyPrimary,
    height: 50,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  outlinedBtn: {
    flex: 0.48,
    borderColor: theme.colors.burgundyPrimary,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  outlinedBtnText: { color: theme.colors.burgundyPrimary, fontWeight: '700', fontSize: 13 },
  demoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    borderColor: theme.colors.iosBorder,
    borderWidth: 1,
    padding: 16,
    marginTop: 20,
  },
  demoTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.burgundyPrimary, marginBottom: 8 },
  demoBtnText: { color: theme.colors.burgundyPrimary, fontWeight: '700', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: theme.borderRadius.large, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: theme.colors.burgundyPrimary }
});
