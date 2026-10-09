import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { TicketPriority, TicketStatus } from '../types';

interface SearchBarProps {
  query: string;
  onQueryChange: (text: string) => void;
  placeholder?: string;
}

export const SearchBarComponent: React.FC<SearchBarProps> = ({ query, onQueryChange, placeholder = 'Search...' }) => {
  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={onQueryChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.iosTextSecondary}
      />
    </View>
  );
};

export const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case TicketStatus.OPEN: return { bg: theme.colors.statusBlueBg, text: theme.colors.statusBlue };
      case TicketStatus.IN_PROGRESS: return { bg: theme.colors.statusOrangeBg, text: theme.colors.statusOrange };
      case TicketStatus.SCHEDULED: return { bg: theme.colors.statusPurpleBg, text: theme.colors.statusPurple };
      case TicketStatus.COMPLETED: return { bg: theme.colors.statusGreenBg, text: theme.colors.statusGreen };
      case TicketStatus.CANCELLED: return { bg: theme.colors.statusRedBg, text: theme.colors.statusRed };
      default: return { bg: theme.colors.iosSurfaceVariant, text: theme.colors.iosTextPrimary };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{status.replace('_', ' ')}</Text>
    </View>
  );
};

export const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
  const getColors = () => {
    switch (priority) {
      case TicketPriority.LOW: return { bg: theme.colors.statusGreenBg, text: theme.colors.statusGreen };
      case TicketPriority.MEDIUM: return { bg: theme.colors.statusOrangeBg, text: theme.colors.statusOrange };
      case TicketPriority.HIGH: return { bg: theme.colors.statusRedBg, text: theme.colors.statusRed };
      case TicketPriority.URGENT: return { bg: '#881337', text: '#FFFFFF' };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{priority}</Text>
    </View>
  );
};

export const StatCard: React.FC<{ title: string; value: string; subtitle?: string }> = ({ title, value, subtitle }) => {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle ? <Text style={styles.statSubtitle}>{subtitle}</Text> : null}
    </View>
  );
};

export const EmptyState: React.FC<{ title: string; description: string; actionLabel?: string; onAction?: () => void }> = ({
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBadge}>
        <Text style={{ fontSize: 32 }}>ℹ️</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDesc}>{description}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.emptyBtn} onPress={onAction}>
          <Text style={styles.emptyBtnText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.iosSearchBg,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: 12,
    height: 44,
    marginVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.iosTextPrimary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statCard: {
    backgroundColor: theme.colors.iosSurface,
    borderRadius: theme.borderRadius.large,
    borderColor: theme.colors.iosBorder,
    borderWidth: 1,
    padding: 16,
    flex: 1,
  },
  statTitle: {
    fontSize: 13,
    color: theme.colors.iosTextSecondary,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.burgundyPrimary,
  },
  statSubtitle: {
    fontSize: 12,
    color: theme.colors.iosTextSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.burgundyContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.iosTextPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    color: theme.colors.iosTextSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyBtn: {
    backgroundColor: theme.colors.burgundyPrimary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.medium,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  }
});
