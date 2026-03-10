<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Usuarios</h1>
          <p class="page-subtitle">Gestiona los usuarios de la plataforma</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Usuario" class="action-btn" no-caps @click="openCreateDialog" />
      </div>

      <!-- Stats Cards -->
      <div class="stats-row">
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 143, 56, 0.2)">
            <q-icon name="people" color="primary" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ users.length }}</div>
            <div class="stat-mini-label">Total Usuarios</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(63, 185, 80, 0.2)">
            <q-icon name="check_circle" color="positive" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ activeUsers }}</div>
            <div class="stat-mini-label">Activos</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(147, 112, 219, 0.2)">
            <q-icon name="admin_panel_settings" color="accent" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ adminUsers }}</div>
            <div class="stat-mini-label">Administradores</div>
          </div>
        </div>
      </div>

      <!-- Main Card -->
      <div class="main-card">
        <div class="card-header-section">
          <div class="search-box">
            <q-icon name="search" class="search-icon" size="20px" />
            <input v-model="searchQuery" type="text" placeholder="Buscar usuarios..." class="search-input">
          </div>
          <div class="header-actions">
            <q-btn flat round icon="filter_list" color="grey-6">
              <q-tooltip>Filtros</q-tooltip>
            </q-btn>
            <q-btn flat round icon="refresh" color="grey-6" :loading="loading" @click="fetchUsers">
              <q-tooltip>Actualizar</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Table -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Última conexión</th>
                <th>Registro</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" v-for="i in 5" :key="i">
                <td colspan="6" class="skeleton-row">
                  <q-skeleton type="text" class="bg-grey-8" />
                </td>
              </tr>
              <tr v-else-if="authError">
                <td colspan="6" class="empty-cell">
                  <div class="empty-table-state">
                    <q-icon name="lock" size="48px" color="orange" />
                    <p>Error de autenticación</p>
                    <q-btn color="primary" label="Reiniciar sesión" no-caps @click="goToLogin" />
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredUsers.length === 0">
                <td colspan="6" class="empty-cell">
                  <div class="empty-table-state">
                    <q-icon name="people_outline" size="48px" color="grey-6" />
                    <p>No se encontraron usuarios</p>
                  </div>
                </td>
              </tr>
              <tr v-for="user in filteredUsers" :key="user.id" class="table-row">
                <td>
                  <div class="user-cell">
                    <q-avatar size="40px" class="user-avatar">
                      <img v-if="user.avatar" :src="user.avatar" :alt="user.nick">
                      <span v-else class="avatar-fallback" :style="{ 
                        background: getAvatarColor(user.nick + user.id).bg,
                        color: getAvatarColor(user.nick + user.id).color
                      }">{{ getInitials(user.nick) }}</span>
                    </q-avatar>
                    <div class="user-info">
                      <div class="user-name">{{ user.nick }}</div>
                      <div class="user-id">ID: {{ user.id }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="email-text">{{ user.email }}</span>
                </td>
                <td>
                  <span class="role-badge" :class="getRoleClass(user.roles)">
                    {{ getRoleLabel(user.roles) }}
                  </span>
                </td>
                <td>
                  <div class="last-login-cell">
                    <q-icon name="schedule" size="14px" class="login-icon" 
                      :color="getLastLoginColor(user.lastlogin)" />
                    <span :class="['login-text', getLastLoginClass(user.lastlogin)]">
                      {{ formatLastLogin(user.lastlogin) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="date-text">{{ formatDate(user.createdAt) }}</span>
                </td>
                <td class="text-right">
                  <q-btn flat round size="sm" icon="edit" color="primary" @click="editUser(user)">
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn flat round size="sm" icon="delete" color="negative" @click="confirmDelete(user)">
                    <q-tooltip>Eliminar</q-tooltip>
                  </q-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-section">
          <span class="pagination-info">Mostrando {{ filteredUsers.length }} de {{ users.length }} usuarios</span>
          <div class="pagination-controls">
            <q-btn flat dense icon="chevron_left" :disable="true" color="grey-6" />
            <q-btn flat dense label="1" color="primary" class="pagination-btn active" />
            <q-btn flat dense icon="chevron_right" :disable="true" color="grey-6" />
          </div>
        </div>
      </div>
    </div>

    <!-- Create Dialog -->
    <q-dialog v-model="createDialog" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <h3 class="dialog-title">Nuevo Usuario</h3>
          <q-btn flat round icon="close" color="grey-6" v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Nickname *</label>
              <q-input v-model="newUser.nick" outlined dark dense placeholder="Ej: juanito" 
                :rules="[val => !!val || 'El nickname es obligatorio']" />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <q-input v-model="newUser.email" outlined dark dense placeholder="email@ejemplo.com" type="email"
                :rules="[val => !!val || 'El email es obligatorio']" />
            </div>
            <div class="form-group">
              <label>Contraseña *</label>
              <q-input v-model="newUser.password" outlined dark dense placeholder="Mínimo 6 caracteres" 
                :type="showNewPassword ? 'text' : 'password'" 
                :rules="[val => !!val || 'La contraseña es obligatoria']">
                <template v-slot:append>
                  <q-icon :name="showNewPassword ? 'visibility_off' : 'visibility'" 
                    class="cursor-pointer" @click="showNewPassword = !showNewPassword" />
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
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn label="Crear Usuario" color="primary" :loading="saving" @click="saveNewUser" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <h3 class="dialog-title">Editar Usuario</h3>
          <q-btn flat round icon="close" color="grey-6" v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-body">
          <div class="form-grid">
            <!-- Avatar Preview -->
            <div class="form-group full-width">
              <label>Avatar</label>
              <div class="avatar-edit-section">
                <q-avatar size="64px" class="edit-avatar">
                  <img v-if="editedUser.avatar" :src="editedUser.avatar" :alt="editedUser.nick" @error="editedUser.avatar = ''">
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
            
            <!-- Password Section -->
            <div class="form-group full-width">
              <q-separator class="section-separator" />
            </div>
            
            <div class="form-group full-width">
              <q-checkbox v-model="changePassword" label="Cambiar contraseña" dark />
            </div>
            
            <div v-if="changePassword" class="form-group full-width password-field">
              <label>Nueva contraseña *</label>
              <q-input v-model="editedUser.password" outlined dark dense placeholder="Mínimo 6 caracteres" 
                :type="showEditPassword ? 'text' : 'password'" 
                :rules="[val => !!val || 'La contraseña es obligatoria']">
                <template v-slot:append>
                  <q-icon :name="showEditPassword ? 'visibility_off' : 'visibility'" 
                    class="cursor-pointer" @click="showEditPassword = !showEditPassword" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn label="Guardar Cambios" color="primary" :loading="saving" @click="saveUser" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card class="dialog-card delete-dialog">
        <q-card-section class="dialog-header">
          <div class="delete-icon">
            <q-icon name="warning" color="negative" size="32px" />
          </div>
          <h3 class="dialog-title">Eliminar Usuario</h3>
          <p class="dialog-subtitle">¿Estás seguro de que quieres eliminar a <strong>{{ userToDelete?.nick }}</strong>?</p>
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn label="Eliminar" color="negative" :loading="deleting" @click="deleteUser" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { userService } from '@/services'
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const users = ref([])
const searchQuery = ref('')
const authError = ref(false)

const createDialog = ref(false)
const editDialog = ref(false)
const deleteDialog = ref(false)
const changePassword = ref(false)
const showNewPassword = ref(false)
const showEditPassword = ref(false)
const newUser = ref({
  nick: '',
  email: '',
  password: '',
  roles: ['ROLE_USER']
})
const editedUser = ref({})
const userToDelete = ref(null)

const roleOptions = [
  { label: 'Usuario', value: 'ROLE_USER' },
  { label: 'Administrador', value: 'ROLE_ADMIN' },
]

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.nick?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query)
  )
})

const activeUsers = computed(() => users.value.length)
const adminUsers = computed(() =>
  users.value.filter(u => u.roles?.includes('ROLE_ADMIN')).length
)

const fetchUsers = async () => {
  loading.value = true
  authError.value = false
  try {
    const response = await userService.getAll()
    
    // API Platform puede devolver en diferentes formatos
    if (response['hydra:member']) {
      users.value = response['hydra:member']
    } else if (response.member) {
      users.value = response.member
    } else if (Array.isArray(response)) {
      users.value = response
    } else {
      users.value = []
    }
  } catch (error) {
    
    if (error.response?.status === 401) {
      authError.value = true
      $q.notify({
        type: 'negative',
        message: 'Sesión expirada. Por favor, inicia sesión de nuevo.',
        position: 'top',
        timeout: 5000
      })
    } else {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Error al cargar usuarios',
        position: 'top'
      })
    }
  } finally {
    loading.value = false
  }
}

const getInitials = (name) => {
  if (!name) return 'U'
  
  const names = name.trim().split(/\s+/)
  
  if (names.length >= 2) {
    // Si hay 2 o más palabras, usa la primera letra de las dos primeras
    return (names[0][0] + names[1][0]).toUpperCase()
  } else {
    // Si es una sola palabra, usa las dos primeras letras
    return names[0].substring(0, 2).toUpperCase()
  }
}

// Genera un color único basado en el string (nombre o ID)
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

const getAvatarColor = (str) => {
  if (!str) return { bg: 'linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%)', color: '#fff' }
  
  // Colores disponibles (gradientes modernos)
  const colors = [
    { bg: 'linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%)', color: '#fff' },      // Naranja
    { bg: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)', color: '#fff' },      // Teal
    { bg: 'linear-gradient(135deg, #9370db 0%, #7c3aed 100%)', color: '#fff' },      // Púrpura
    { bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)', color: '#fff' },      // Rojo
    { bg: 'linear-gradient(135deg, #3fb950 0%, #2ea043 100%)', color: '#fff' },      // Verde
    { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff' },      // Ámbar
    { bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: '#fff' },      // Rosa
    { bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#fff' },      // Cyan
    { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff' },      // Violeta
    { bg: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', color: '#fff' },      // Esmeralda
    { bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff' },      // Naranja oscuro
    { bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff' },      // Indigo
  ]
  
  // Genera un hash numérico del string
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convierte a 32bit integer
  }
  
  // Usa el hash para seleccionar un color
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

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

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Parsea fecha del formato 'd-m-Y H:i:s' o ISO a Date
const parseDate = (dateString) => {
  if (!dateString) return null
  
  // Si es formato ISO (2025-11-08T15:30:45)
  if (dateString.includes('T')) {
    return new Date(dateString)
  }
  
  // Si es formato d-m-Y H:i:s (08-11-2025 15:30:45)
  const parts = dateString.split(' ')
  const dateParts = parts[0].split('-')
  const timeParts = parts[1] ? parts[1].split(':') : ['00', '00', '00']
  
  // dateParts: [day, month, year]
  // Creamos fecha en formato ISO: YYYY-MM-DDTHH:mm:ss
  const isoString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`
  return new Date(isoString)
}

const formatLastLogin = (lastLogin) => {
  if (!lastLogin) return 'Nunca'
  
  const lastLoginDate = parseDate(lastLogin)
  if (!lastLoginDate || isNaN(lastLoginDate.getTime())) {
    console.warn('Fecha inválida:', lastLogin)
    return 'Fecha desconocida'
  }
  
  const now = new Date()
  const diffMs = now - lastLoginDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Justo ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} h`
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem`
  
  return lastLoginDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short'
  })
}

const getLastLoginColor = (lastLogin) => {
  if (!lastLogin) return 'grey-6'
  
  const lastLoginDate = parseDate(lastLogin)
  if (!lastLoginDate || isNaN(lastLoginDate.getTime())) return 'grey-6'
  
  const now = new Date()
  const diffMs = now - lastLoginDate
  const diffHours = diffMs / 3600000
  
  if (diffHours < 1) return 'positive'  // Verde - hace menos de 1 hora
  if (diffHours < 24) return 'primary'  // Naranja - hace menos de 24h
  if (diffHours < 168) return 'warning' // Amarillo - hace menos de 1 semana
  return 'grey-6'                       // Gris - más de 1 semana
}

const getLastLoginClass = (lastLogin) => {
  if (!lastLogin) return 'login-old'
  
  const lastLoginDate = parseDate(lastLogin)
  if (!lastLoginDate || isNaN(lastLoginDate.getTime())) return 'login-old'
  
  const now = new Date()
  const diffMs = now - lastLoginDate
  const diffHours = diffMs / 3600000
  
  if (diffHours < 1) return 'login-recent'
  if (diffHours < 24) return 'login-today'
  if (diffHours < 168) return 'login-week'
  return 'login-old'
}

const goToLogin = () => {
  router.push({ name: 'login' })
}

const openCreateDialog = () => {
  newUser.value = {
    nick: '',
    email: '',
    password: '',
    avatar: '',  // Campo requerido por el backend
    roles: ['ROLE_USER']
  }
  createDialog.value = true
}

const saveNewUser = async () => {
  if (!newUser.value.nick || !newUser.value.email || !newUser.value.password) {
    $q.notify({
      type: 'warning',
      message: 'Completa todos los campos obligatorios',
      position: 'top'
    })
    return
  }

  saving.value = true
  try {
    // Aseguramos que avatar tenga un valor (vacío si no se proporciona)
    const userData = {
      ...newUser.value,
      avatar: newUser.value.avatar || ''
    }
    
    await userService.create(userData)
    
    $q.notify({
      type: 'positive',
      message: 'Usuario creado correctamente',
      position: 'top'
    })
    createDialog.value = false
    fetchUsers()
  } catch (error) {
    let errorMsg = 'Error al crear usuario'
    if (error.response?.data?.['hydra:description']) {
      errorMsg = error.response.data['hydra:description']
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    } else if (error.response?.data?.detail) {
      errorMsg = error.response.data.detail
    } else if (error.message) {
      errorMsg = error.message
    }
    
    $q.notify({
      type: 'negative',
      message: errorMsg,
      position: 'top',
      timeout: 5000
    })
  } finally {
    saving.value = false
  }
}

const editUser = (user) => {
  editedUser.value = { 
    ...user,
    avatar: user.avatar || ''
  }
  changePassword.value = false
  editDialog.value = true
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
    
    // Solo incluir password si se quiere cambiar
    if (changePassword.value && editedUser.value.password) {
      updateData.password = editedUser.value.password
    }
    
    await userService.update(editedUser.value.id, updateData)
    $q.notify({
      type: 'positive',
      message: 'Usuario actualizado correctamente',
      position: 'top'
    })
    editDialog.value = false
    fetchUsers()
  } catch (error) {
    let errorMsg = 'Error al actualizar usuario'
    if (error.response?.data?.['hydra:description']) {
      errorMsg = error.response.data['hydra:description']
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    }
    $q.notify({
      type: 'negative',
      message: errorMsg,
      position: 'top'
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user
  deleteDialog.value = true
}

const deleteUser = async () => {
  deleting.value = true
  try {
    await userService.delete(userToDelete.value.id)
    $q.notify({
      type: 'positive',
      message: 'Usuario eliminado correctamente',
      position: 'top'
    })
    deleteDialog.value = false
    fetchUsers()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar usuario',
      position: 'top'
    })
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

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #8b949e;
  margin: 0;
}

.action-btn {
  background: linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%);
  border-radius: 12px;
  font-weight: 600;
}

/* Stats Row */
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px 24px;
  flex: 1;
}

.stat-mini-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-mini-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.stat-mini-label {
  font-size: 0.85rem;
  color: #8b949e;
}

/* Main Card */
.main-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
}

.card-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-box {
  position: relative;
  width: 320px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b949e;
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px 12px 48px;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #8b949e;
}

.search-input:focus {
  border-color: rgba(255, 143, 56, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 16px 24px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.data-table td {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

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

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background: rgba(63, 185, 80, 0.15);
  color: #3fb950;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #3fb950;
  border-radius: 50%;
}

.date-text {
  color: #8b949e;
  font-size: 0.9rem;
}

/* Last Login Cell */
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

.skeleton-row {
  padding: 20px 24px;
}

.empty-cell {
  padding: 60px 24px;
}

.empty-table-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #8b949e;
}

.empty-table-state p {
  margin: 0;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.pagination-info {
  color: #8b949e;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.pagination-btn.active {
  background: rgba(255, 143, 56, 0.2);
}

/* Dialogs */
.dialog-card {
  background: #1a1f2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  min-width: 480px;
}

.delete-dialog {
  text-align: center;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.delete-dialog .dialog-header {
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.delete-icon {
  width: 64px;
  height: 64px;
  background: rgba(248, 81, 73, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.dialog-subtitle {
  color: #8b949e;
  margin: 0;
}

.dialog-subtitle strong {
  color: #ffffff;
}

.dialog-body {
  padding: 24px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

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

/* Responsive */
@media (max-width: 900px) {
  .stats-row {
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .card-header-section {
    flex-direction: column;
    gap: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
