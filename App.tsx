import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { theme } from './theme';
import { User, UserRole } from './types';
import { AuthScreen } from './screens/AuthScreen';
import { ResidentScreen } from './screens/ResidentScreen';
import { OwnerScreen } from './screens/OwnerScreen';
import { MaintenanceScreen } from './screens/MaintenanceScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleSelectRoleDemo = (role: UserRole) => {
    const user: User = {
      uid: `demo_${role.toLowerCase()}_1`,
      name: role === UserRole.RESIDENT ? 'Rohan Sharma' : role === UserRole.PROPERTY_OWNER ? 'Anand Verma' : 'Vikram Kumar',
      email: `${role.toLowerCase()}@staynest.com`,
      phone: '+91 9876543210',
      role: role,
      isApproved: true,
      createdAt: Date.now(),
    };
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.iosSurface} />
      {currentUser === null ? (
        <AuthScreen onSelectRoleDemo={handleSelectRoleDemo} />
      ) : currentUser.role === UserRole.RESIDENT ? (
        <ResidentScreen user={currentUser} onSignOut={handleSignOut} />
      ) : currentUser.role === UserRole.PROPERTY_OWNER ? (
        <OwnerScreen user={currentUser} onSignOut={handleSignOut} />
      ) : (
        <MaintenanceScreen user={currentUser} onSignOut={handleSignOut} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.iosBackground,
  },
});
