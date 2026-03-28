<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <PageHeader
        title="Usuarios"
        subtitle="Gestiona los usuarios de la plataforma"
        action-label="Nuevo Usuario"
        @action="openCreateDialog"
      />

      <!-- Stats Cards -->
      <StatsCards :stats="stats" />

      <!-- Main Card -->
      <div class="main-card">
        <SearchFilters
          v-model="searchQuery"
          placeholder="Buscar usuarios..."
          :loading="loading"
          @refresh="fetchUsers"
        />

        <!-- Table -->
        <DataTable
          :columns="columns"
          :items="filteredUsers"
          :loading="loading"
          :error="error"
          empty-icon="people_outline"
          empty-text="No se encontraron usuarios"
          item-name="usuarios"
          @edit="editUser"
          @delete="confirmDelete"
          @refresh="fetchUsers"
        >
          <template #cell-user="{ item }">
            <div class="user-cell">
              <q-avatar size="40px" class="user-avatar">
                <img v-if="item.avatar" :src="item.avatar" :alt="item.nick">
                <span v-else class="avatar-fallback" :style="{
                  background: getAvatarColor(item.nick + item.id).bg,
                  color: getAvatarColor(item.nick + item.id).color
                }">{{ getInitials(item.nick) }}</span>
              </q-avatar>
              <div class="user-info">
                <div class="user-name">{{ item.nick }}</div>
                <div class="user-id">ID: {{ item.id }}</div>
              </div>
            </div>
          </template>

          <template #cell-email="{ value }">
            <span class="email-text">{{ value }}</span>
          </template>

          <template #cell-roles="{ value }">
            <span class="role-badge" :class="getRoleClass(value)">
              {{ getRoleLabel(value) }}
            </span>
          </template>

          <template #cell-lastLogin="{ value }">
            <div class="last-login-cell">
              <q-icon name="schedule" size="14px" class="login-icon" :color="getLastLoginColor(value)" />
              <span :class="['login-text', getLastLoginClass(value)]">
                {{ formatLastLogin(value) }}
              </span>
            </div>
          </template>

          <template #cell-createdAt="{ value }">
            <span class="date-text">{{ formatDate(value) }}</span>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Create Dialog -->
    <FormDialog
      v-model="showCreateDialog"
      title="Nuevo Usuario"
      confirm-label="Crear Usuario"
      :loading="saving"
      @confirm="saveNewUser"
    >
      <div class="form-grid">
        <div class="form-group">
          <label>Nickname *</label>
          <q-input v-model="newUser.nick" outlined dark dense placeholder="Ej: juanito"
            :error="!newUser.nick && showErrors" error-message="El nickname es obligatorio" />
        </div>
        <div class="form-group">
          <label>Email *</label>
          <q-input v-model="newUser.email" outlined dark dense placeholder="email@ejemplo.com" type="email"
            :error="!newUser.email && showErrors" error-message="El email es obligatorio" />
        </div>
        <div class="form-group">
          <label>Contraseña *</label>
          <q-input v-model="newUser.password" outlined dark dense placeholder="Mínimo 6 caracteres"
            :type="showNewPassword ? 'text' : 'password'"
            :error="!newUser.password && showErrors" error-message="La contraseña es obligatoria">
            <template #append>
              <q-icon :name="showNewPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="showNewPassword = !showNewPassword" />
            </template>
          </q-input>
        </div>
        <div class="form-group full-width">
          <label>Avatar URL (opcional)</label>
          <q-input v-model="newUser.avatar" outlined dark dense placeholder="https://ejemplo.com/avatar.jpg"
            hint="Dejar vacío para usar iniciales" />
        </div>
        <div class="form-group">
          <label>Rol</label>
          <q-select v-model="newUser.roles" :options="roleOptions" outlined dark dense multiple emit-value
            map-options option-value="value" option-label="label" placeholder="Selecciona rol" />
        </div>
      </div>
    </FormDialog>

    <!-- Edit Dialog -->
    <FormDialog
      v-model="showEditDialog"
      title="Editar Usuario"
      confirm-label="Guardar Cambios"
      :loading="saving"
      @confirm="saveUser"
    >
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Avatar</label>
          <div class="avatar-edit-section">
            <q-avatar size="64px" class="edit-avatar">
              <img v-if="editedUser.avatar" :src="editedUser.avatar" :alt="editedUser.nick"
                @error="editedUser.avatar = ''">
              <span v-else :style="getAvatarPreviewStyle()">{{ getInitials(editedUser.nick) }}</span>
            </q-avatar>
            <div class="avatar-input-wrapper">
              <q-input v-model="editedUser.avatar" outlined dark dense placeholder="https://ejemplo.com/avatar.jpg"
                hint="URL de la imagen (dejar vacío para usar iniciales)" class="avatar-input" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Nickname</label>
          <q-input v-model="editedUser.nick" outlined dark dense placeholder="Nickname del usuario" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <q-input v-model="editedUser.email" outlined dark dense placeholder="email@ejemplo.com" type="email" />
        </div>
        <div class="form-group full-width">
          <label>Roles</label>
          <q-select v-model="editedUser.roles" :options="roleOptions" outlined dark dense multiple emit-value
            map-options option-value="value" option-label="label" placeholder="Selecciona roles" />
        </div>

        <div class="form-group full-width">
          <q-separator class="section-separator" />
        </div>

        <div class="form-group full-width">
          <q-checkbox v-model="changePassword" label="Cambiar contraseña" dark />
        </div>

        <div v-if="changePassword" class="form-group full-width password-field">
          <label>Nueva contraseña *</label>
          <q-input v-model="editedUser.password" outlined dark dense placeholder="Mínimo 6 caracteres"
            :type="showEditPassword ? 'text' : 'password'">
            <template #append>
              <q-icon :name="showEditPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="showEditPassword = !showEditPassword" />
            </template>
          </q-input>
        </div>
      </div>
    </FormDialog>

    <!-- Delete Dialog -->
    <FormDialog
      v-model="showDeleteDialog"
      title="Eliminar Usuario"
      :subtitle="`¿Estás seguro de que quieres eliminar a <strong>${userToDelete?.nick}</strong>?`"
      is-delete
      confirm-label="Eliminar"
      confirm-color="negative"
      :loading="deleting"
      @confirm="deleteUser"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useUsersStore } from '@/stores/users'
import { useHelpers } from '@/composables/useHelpers'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCards from '@/components/common/StatsCards.vue'
import SearchFilters from '@/components/common/SearchFilters.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'

const { getInitials, formatDate, formatLastLogin } = useHelpers()

const $q = useQuasar()
// const router = useRouter()
const usersStore = useUsersStore()

// State
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const error = ref('')
const showErrors = ref(false)

// Dialogs
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const changePassword = ref(false)
const showNewPassword = ref(false)
const showEditPassword = ref(false)

// Form data
const newUser = ref({ nick: '', email: '', password: '', avatar: '', roles: ['ROLE_USER'] })
const editedUser = ref({})
const userToDelete = ref(null)

// Constants
const roleOptions = [
  { label: 'Usuario', value: 'ROLE_USER' },
  { label: 'Administrador', value: 'ROLE_ADMIN' },
]

const columns = [
  { key: 'user', label: 'Usuario' },
  { key: 'email', label: 'Email' },
  { key: 'roles', label: 'Rol' },
  { key: 'lastLogin', label: 'Última conexión' },
  { key: 'createdAt', label: 'Registro' },
]

// Computed
const stats = computed(() => [
  { value: usersStore.totalUsers, label: 'Total Usuarios', icon: 'people' },
  { value: usersStore.totalUsers, label: 'Activos', icon: 'check_circle' },
  { value: usersStore.adminUsers, label: 'Administradores', icon: 'admin_panel_settings' },
])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return usersStore.users
  const query = searchQuery.value.toLowerCase()
  return usersStore.users.filter(user =>
    user.nick?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query)
  )
})

// Methods
const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    await usersStore.fetchUsers()
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Sesión expirada'
      $q.notify({ type: 'negative', message: 'Sesión expirada. Por favor, inicia sesión de nuevo.', position: 'top', timeout: 5000 })
    } else {
      error.value = 'Error al cargar usuarios'
      $q.notify({ type: 'negative', message: error.value, position: 'top' })
    }
  } finally {
    loading.value = false
  }
}

// Avatar helpers


const getAvatarColor = (str) => {
  if (!str) return { bg: 'linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%)', color: '#fff' }

  const colors = [
    { bg: 'linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #9370db 0%, #7c3aed 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #3fb950 0%, #2ea043 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff' },
  ]

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  const index = Math.abs(hash) % colors.length
  return colors[index]
}

const getAvatarPreviewStyle = () => {
  const color = getAvatarColor(editedUser.value.nick + editedUser.value.id)
  return {
    background: color.bg,
    color: color.color,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '1.5rem',
    borderRadius: '50%'
  }
}

// Role helpers
const getRoleLabel = (roles) => {
  if (!roles) return 'Usuario'
  if (roles.includes('ROLE_ADMIN')) return 'Administrador'
  return 'Usuario'
}

const getRoleClass = (roles) => {
  if (!roles) return 'role-user'
  if (roles.includes('ROLE_ADMIN')) return 'role-admin'
  return 'role-user'
}

// Date helpers - usando composable useHelpers
const parseDate = (dateString) => {
  if (!dateString) return null
  if (dateString.includes('T')) {
    return new Date(dateString)
  }
  const parts = dateString.split(' ')
  const dateParts = parts[0].split('-')
  const timeParts = parts[1] ? parts[1].split(':') : ['00', '00', '00']
  const isoString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`
  return new Date(isoString)
}

const getLastLoginColor = (lastLogin) => {
  if (!lastLogin) return 'grey-6'
  const lastLoginDate = parseDate(lastLogin)
  if (!lastLoginDate || isNaN(lastLoginDate.getTime())) return 'grey-6'

  const now = new Date()
  const diffHours = (now - lastLoginDate) / 3600000

  if (diffHours < 1) return 'positive'
  if (diffHours < 24) return 'primary'
  if (diffHours < 168) return 'warning'
  return 'grey-6'
}

const getLastLoginClass = (lastLogin) => {
  if (!lastLogin) return 'login-old'
  const lastLoginDate = parseDate(lastLogin)
  if (!lastLoginDate || isNaN(lastLoginDate.getTime())) return 'login-old'

  const now = new Date()
  const diffHours = (now - lastLoginDate) / 3600000

  if (diffHours < 1) return 'login-recent'
  if (diffHours < 24) return 'login-today'
  if (diffHours < 168) return 'login-week'
  return 'login-old'
}

// CRUD Operations
const openCreateDialog = () => {
  newUser.value = { nick: '', email: '', password: '', avatar: '', roles: ['ROLE_USER'] }
  showErrors.value = false
  showCreateDialog.value = true
}

const saveNewUser = async () => {
  if (!newUser.value.nick || !newUser.value.email || !newUser.value.password) {
    showErrors.value = true
    return
  }

  saving.value = true
  try {
    await usersStore.createUser({
      ...newUser.value,
      avatar: newUser.value.avatar || ''
    })
    showCreateDialog.value = false
  } catch {
    // Error ya manejado por el store
  } finally {
    saving.value = false
  }
}

const editUser = (user) => {
  editedUser.value = { ...user, avatar: user.avatar || '' }
  changePassword.value = false
  showEditDialog.value = true
}

const saveUser = async () => {
  saving.value = true
  try {
    const updateData = {
      nick: editedUser.value.nick,
      email: editedUser.value.email,
      avatar: editedUser.value.avatar || '',
      roles: editedUser.value.roles
    }

    if (changePassword.value && editedUser.value.password) {
      updateData.password = editedUser.value.password
    }

    await usersStore.updateUser(editedUser.value.id, updateData)
    showEditDialog.value = false
  } catch {
    // Error ya manejado por el store
  } finally {
    saving.value = false
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteDialog.value = true
}

const deleteUser = async () => {
  deleting.value = true
  try {
    await usersStore.deleteUser(userToDelete.value.id)
    showDeleteDialog.value = false
  } catch {
    // Error ya manejado por el store
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.page-container {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%);
  min-height: 100vh;
}

.page-content {
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.main-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.user-name {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.user-id {
  font-size: 0.8rem;
  color: #8b949e;
}

.email-text {
  color: #c9d1d9;
  font-size: 0.9rem;
}

/* Roles */
.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-admin {
  background: rgba(147, 112, 219, 0.2);
  color: #9370db;
}

.role-user {
  background: rgba(56, 178, 172, 0.2);
  color: #38b2ac;
}

/* Last Login */
.last-login-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-icon {
  opacity: 0.8;
}

.login-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.login-recent {
  color: #3fb950;
}

.login-today {
  color: #ff8f38;
}

.login-week {
  color: #f59e0b;
}

.login-old {
  color: #8b949e;
}

.date-text {
  color: #8b949e;
  font-size: 0.9rem;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #c9d1d9;
}

/* Avatar Edit Section */
.avatar-edit-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.edit-avatar {
  border: 2px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.avatar-input-wrapper {
  flex: 1;
}

.avatar-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.05);
}

.section-separator {
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
}

.password-field {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
