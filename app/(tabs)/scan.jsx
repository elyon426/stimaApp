// app/(tabs)/scan.jsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const BRAND = '#0da134';
const BRAND_LIGHT = '#f0fff4';
const GRAY = '#9CA3AF';
const DARK = '#111827';
const SOFT = '#6B7280';

// ─── Mock QR placeholder (replace with real QR lib later) ────────────
function QRPlaceholder({ amount }) {
  return (
    <View style={styles.qrBox}>
      <MaterialCommunityIcons name="qrcode" size={160} color={DARK} />
      {amount ? (
        <View style={styles.amountBadge}>
          <Text style={styles.amountBadgeText}>KES {Number(amount).toLocaleString()}</Text>
        </View>
      ) : (
        <Text style={styles.noAmountText}>No amount set</Text>
      )}
    </View>
  );
}

// ─── My QR screen ─────────────────────────────────────────────────────
function MyQRScreen() {
  const [amount, setAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const handleUpdate = () => {
    if (!inputVal.trim()) return;
    setSavedAmount(inputVal.trim());
    setAmount(inputVal.trim());
    setEditing(false);
    setInputVal('');
  };

  const handleClear = () => {
    setSavedAmount('');
    setAmount('');
    setEditing(false);
    setInputVal('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.myQrContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Your QR Code</Text>
        <Text style={styles.sectionSub}>
          {savedAmount
            ? 'Share this with the sender'
            : 'Set an amount so the sender pays exactly'}
        </Text>

        <QRPlaceholder amount={savedAmount} />

        {/* Update amount section */}
        {editing ? (
          <View style={styles.editCard}>
            <Text style={styles.editLabel}>Enter amount (KES)</Text>
            <TextInput
              style={styles.amountInput}
              value={inputVal}
              onChangeText={setInputVal}
              placeholder="e.g. 1500"
              placeholderTextColor={GRAY}
              keyboardType="numeric"
              autoFocus
              maxLength={10}
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setEditing(false); setInputVal(''); }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.updateBtn, !inputVal.trim() && styles.updateBtnDisabled]}
                onPress={handleUpdate}
                activeOpacity={0.8}
                disabled={!inputVal.trim()}
              >
                <MaterialCommunityIcons name="qrcode-edit" size={18} color="#fff" />
                <Text style={styles.updateText}>Update QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editTrigger}
              onPress={() => { setEditing(true); setInputVal(savedAmount); }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="qrcode-edit" size={20} color={BRAND} />
              <Text style={styles.editTriggerText}>
                {savedAmount ? 'Change amount' : 'Set amount'}
              </Text>
            </TouchableOpacity>

            {savedAmount ? (
              <TouchableOpacity
                style={styles.clearTrigger}
                onPress={handleClear}
                activeOpacity={0.8}
              >
                <Ionicons name="close-circle-outline" size={20} color={SOFT} />
                <Text style={styles.clearText}>Clear amount</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}

        <Text style={styles.hint}>
          <Ionicons name="information-circle-outline" size={13} color={SOFT} />
          {' '}QR code updates instantly when you change the amount
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Scan QR screen ───────────────────────────────────────────────────
function ScanQRScreen() {
  return (
    <View style={styles.scanContainer}>
      <View style={styles.scanFrame}>
        {/* Corner markers */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
        <MaterialCommunityIcons name="line-scan" size={36} color={BRAND} style={styles.scanLine} />
      </View>
      <Text style={styles.scanTitle}>Scan Member QR</Text>
      <Text style={styles.scanSub}>Point camera at a Stima Sacco QR code to send or receive</Text>
    </View>
  );
}

// ─── Main screen with top toggle ──────────────────────────────────────
export default function Scan() {
  const [mode, setMode] = useState(null); // null | 'myqr' | 'scan'

  if (mode === 'myqr') {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <TouchableOpacity style={styles.backRow} onPress={() => setMode(null)} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={BRAND} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <MyQRScreen />
      </View>
    );
  }

  if (mode === 'scan') {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <TouchableOpacity style={styles.backRow} onPress={() => setMode(null)} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={BRAND} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <ScanQRScreen />
      </View>
    );
  }

  // Landing — pick mode
  return (
    <View style={styles.landing}>
      <MaterialCommunityIcons name="qrcode" size={56} color={BRAND} style={{ marginBottom: 12 }} />
      <Text style={styles.landingTitle}>QR Payments</Text>
      <Text style={styles.landingSub}>Choose what you'd like to do</Text>

      <View style={styles.optionStack}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => setMode('myqr')}
          activeOpacity={0.85}
        >
          <View style={styles.optionIcon}>
            <MaterialCommunityIcons name="qrcode" size={32} color={BRAND} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>My QR Code</Text>
            <Text style={styles.optionDesc}>Show your code to receive payment</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={GRAY} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => setMode('scan')}
          activeOpacity={0.85}
        >
          <View style={styles.optionIcon}>
            <MaterialCommunityIcons name="qrcode-scan" size={32} color={BRAND} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Scan QR Code</Text>
            <Text style={styles.optionDesc}>Scan a member's code to send payment</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={GRAY} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Landing ──
  landing: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  landingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DARK,
    marginBottom: 6,
  },
  landingSub: {
    fontSize: 14,
    color: SOFT,
    marginBottom: 36,
  },
  optionStack: {
    width: '100%',
    gap: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: BRAND_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 3 },
  optionDesc: { fontSize: 13, color: SOFT },

  // ── Back button ──
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 56,
    paddingBottom: 8,
  },
  backText: { fontSize: 15, color: BRAND, fontWeight: '600' },

  // ── My QR ──
  myQrContainer: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DARK,
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: 13,
    color: SOFT,
    textAlign: 'center',
    marginBottom: 28,
  },
  qrBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    width: '100%',
  },
  amountBadge: {
    marginTop: 14,
    backgroundColor: BRAND_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: BRAND,
  },
  amountBadgeText: {
    color: BRAND,
    fontWeight: '700',
    fontSize: 16,
  },
  noAmountText: {
    marginTop: 12,
    fontSize: 13,
    color: GRAY,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  editTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: BRAND_LIGHT,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BRAND,
  },
  editTriggerText: { color: BRAND, fontWeight: '600', fontSize: 14 },
  clearTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  clearText: { color: SOFT, fontWeight: '600', fontSize: 14 },
  editCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  editLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: SOFT,
    marginBottom: 10,
  },
  amountInput: {
    borderWidth: 1.5,
    borderColor: BRAND,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '700',
    color: DARK,
    marginBottom: 14,
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelText: { color: SOFT, fontWeight: '600' },
  updateBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND,
    paddingVertical: 12,
    borderRadius: 12,
  },
  updateBtnDisabled: { opacity: 0.4 },
  updateText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  hint: {
    fontSize: 12,
    color: SOFT,
    textAlign: 'center',
    marginTop: 4,
  },

  // ── Scan ──
  scanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  scanFrame: {
    width: 220,
    height: 220,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: BRAND,
    borderWidth: 3,
  },
  cornerTL: { top: 10, left: 10, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: 10, right: 10, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: 10, left: 10, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 10, right: 10, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },
  scanLine: { opacity: 0.5 },
  scanTitle: { fontSize: 20, fontWeight: '700', color: DARK, marginBottom: 8 },
  scanSub: { fontSize: 13, color: SOFT, textAlign: 'center' },
});