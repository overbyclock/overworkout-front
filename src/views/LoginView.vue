<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <img src="/logo.png" alt="logo">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para acceder</p>
        </div>

        <form class="login-form">
          <q-input v-model="email" type="email" label="Email" outlined dark class="login-input" />

          <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Contraseña" outlined dark
            class="login-input">
            <template v-slot:append>
              <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                @click="showPassword = !showPassword" />
            </template>
          </q-input>

          <div class="login-options">
            <q-checkbox v-model="rememberMe" label="Recordarme" dark />
            <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <q-btn @click="handlelogin" label="Iniciar Sesión" class="login-btn" size="lg" no-caps />

          <p class="signup-text">
            ¿No tienes cuenta? <a href="#" class="signup-link">Regístrate aquí</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const handlelogin = async () => {
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })

    router.push({ name: 'admin-dashboard' })
  } catch (error) {
    console.error('Error de login: ', error.message)
  }
}

</script>
<style scoped>
/* Página completa de login */
.login-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 143, 56, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 143, 56, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, var(--color-dark) 0%, var(--color-secondary) 50%, var(--color-sidebar-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* Contenedor principal */
.login-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
}

/* Tarjeta del formulario */
.login-card {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 100%;
}

/* Sección del logo */
.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section img {
  width: 120px;
  height: auto;
  margin-bottom: 1rem;
}

.logo-section h2 {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.logo-section p {
  color: var(--color-title-text);
  font-size: 0.9rem;
  margin-bottom: 0;
}

/* Formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Inputs */
.login-input {
  margin-bottom: 0;
}

.login-input :deep(.q-field__control) {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--color-border);
}

.login-input :deep(.q-field__native) {
  color: white;
}

.login-input :deep(.q-field__label) {
  color: var(--color-title-text);
}

.login-input :deep(.q-field--focused .q-field__control) {
  border-color: var(--color-primary);
}

.login-input :deep(.q-field--focused .q-field__label) {
  color: var(--color-primary);
}

/* Opciones de login */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}

.login-options :deep(.q-checkbox__label) {
  color: var(--color-title-text);
}

.forgot-link {
  color: var(--color-title-text);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: var(--color-primary);
}

/* Botón de login */
.login-btn {
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  border-radius: var(--border-radius-md);
  padding: 0.75rem 2rem;
  transition: all 0.3s ease;
  margin: 0.5rem 0;
}

.login-btn:hover {
  background-color: #e67e2e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 143, 56, 0.3);
}

/* Texto de registro */
.signup-text {
  text-align: center;
  color: var(--color-title-text);
  font-size: 0.9rem;
  margin: 1rem 0 0 0;
}

.signup-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: #e67e2e;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-page {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem;
  }

  .logo-section img {
    width: 100px;
  }
}
</style>
