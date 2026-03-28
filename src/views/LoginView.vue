<template>
  <div class="login-page">
    <!-- Background Elements -->
    <div class="bg-pattern"></div>
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>
    <div class="bg-glow bg-glow-3"></div>

    <!-- Floating Shapes -->
    <div class="floating-shape shape-1">
      <q-icon name="fitness_center" />
    </div>
    <div class="floating-shape shape-2">
      <q-icon name="sports_gymnastics" />
    </div>
    <div class="floating-shape shape-3">
      <q-icon name="timer" />
    </div>

    <!-- Main Container -->
    <div class="login-container">
      <!-- Left Side - Branding (Desktop) -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="brand-logo-large">
            <img src="./logo.png" alt="OverWorkout" />
          </div>
          <h1 class="brand-title">OverWorkout</h1>
          <p class="brand-tagline">Tu plataforma de entrenamiento personalizado</p>
          
          <div class="brand-features">
            <div class="feature-item">
              <div class="feature-icon">
                <q-icon name="fitness_center" />
              </div>
              <span>+100 ejercicios</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <q-icon name="schedule" />
              </div>
              <span>Rutinas personalizadas</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <q-icon name="trending_up" />
              </div>
              <span>Seguimiento de progreso</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="form-section">
        <div class="form-card">
          <!-- Mobile Logo -->
          <div class="mobile-brand">
            <img src="./logo.png" alt="OverWorkout" class="mobile-logo" />
            <h2>OverWorkout</h2>
          </div>

          <div class="form-header">
            <h3>Bienvenido de vuelta</h3>
            <p>Ingresa tus credenciales para acceder al panel</p>
          </div>

          <form class="login-form" @submit.prevent="handleLogin">
            <!-- Email Input -->
            <div class="input-group">
              <label class="input-label">Email</label>
              <div class="input-wrapper" :class="{ focused: emailFocused }">
                <q-icon name="mail_outline" class="input-icon" />
                <input 
                  v-model="email" 
                  type="email" 
                  placeholder="tu@email.com"
                  @focus="emailFocused = true"
                  @blur="emailFocused = false"
                  class="custom-input"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="input-group">
              <label class="input-label">Contraseña</label>
              <div class="input-wrapper" :class="{ focused: passwordFocused }">
                <q-icon name="lock_outline" class="input-icon" />
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  @focus="passwordFocused = true"
                  @blur="passwordFocused = false"
                  class="custom-input"
                />
                <button 
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" />
                </button>
              </div>
            </div>

            <!-- Options -->
            <div class="login-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                <span class="checkbox-label">Recordarme</span>
              </label>
              <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="submit-btn"
              :class="{ loading: loading }"
              :disabled="loading || !email || !password"
            >
              <q-spinner v-if="loading" color="white" size="20px" />
              <span v-else>Iniciar Sesión</span>
              <q-icon v-if="!loading" name="arrow_forward" class="btn-icon" />
            </button>

            <!-- Divider -->
            <div class="divider">
              <span>O continúa con</span>
            </div>

            <!-- Social Login -->
            <div class="social-login">
              <button type="button" class="social-btn google">
                <img src="https://www.google.com/favicon.ico" alt="Google" />
              </button>
              <button type="button" class="social-btn apple">
                <q-icon name="apple" />
              </button>
            </div>
          </form>

          <!-- Footer -->
          <div class="form-footer">
            <p>¿No tienes cuenta? <a href="#" class="signup-link">Regístrate gratis</a></p>
          </div>
        </div>

        <!-- Version -->
        <div class="version-tag">
          <span>v1.0.0</span>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="slide-up">
      <div v-if="error" class="error-toast">
        <q-icon name="error_outline" color="white" />
        <span>{{ error }}</span>
        <button @click="error = null" class="close-toast">
          <q-icon name="close" />
        </button>
      </div>
    </transition>
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
const emailFocused = ref(false)
const passwordFocused = ref(false)
const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  if (!email.value || !password.value) return
  
  loading.value = true
  error.value = null
  
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    router.push({ name: 'admin-dashboard' })
  } catch (err) {
    error.value = err.message || 'Error al iniciar sesión'
    setTimeout(() => error.value = null, 5000)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ===== PAGE BACKGROUND ===== */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #161b22 50%, #0d1117 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px;
}

/* Pattern Overlay */
.bg-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.03) 1px, transparent 0);
  background-size: 40px 40px;
  pointer-events: none;
}

/* Glow Effects */
.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  pointer-events: none;
}

.bg-glow-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, rgba(255, 143, 56, 0.3) 0%, transparent 70%);
  top: -200px;
  right: -100px;
}

.bg-glow-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, rgba(56, 178, 172, 0.2) 0%, transparent 70%);
  bottom: -150px;
  left: -100px;
}

.bg-glow-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(147, 112, 219, 0.2) 0%, transparent 70%);
  top: 50%;
  left: 30%;
}

/* Floating Shapes */
.floating-shape {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 28px;
  animation: float 6s ease-in-out infinite;
  pointer-events: none;
}

.shape-1 {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  top: 60%;
  left: 8%;
  animation-delay: 2s;
}

.shape-3 {
  top: 25%;
  right: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* ===== MAIN CONTAINER ===== */
.login-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  position: relative;
  z-index: 1;
}

/* ===== BRAND SECTION (Left) ===== */
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, rgba(255, 143, 56, 0.1) 0%, rgba(255, 143, 56, 0.02) 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
}

.brand-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 30% 70%, rgba(255, 143, 56, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(56, 178, 172, 0.1) 0%, transparent 50%);
}

.brand-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.brand-logo-large {
  width: 140px;
  height: 140px;
  margin: 0 auto 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 143, 56, 0.3) inset;
}

.brand-logo-large img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #ffffff 0%, #ff8f38 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  font-size: 1.1rem;
  color: #8b949e;
  margin: 0 0 48px 0;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 280px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  color: #c9d1d9;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 143, 56, 0.3);
  transform: translateX(4px);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(255, 143, 56, 0.2) 0%, rgba(255, 143, 56, 0.1) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff8f38;
  font-size: 20px;
}

/* ===== FORM SECTION (Right) ===== */
.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
  position: relative;
}

.form-card {
  width: 100%;
  max-width: 400px;
}

/* Mobile Brand (hidden on desktop) */
.mobile-brand {
  display: none;
  text-align: center;
  margin-bottom: 32px;
}

.mobile-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.mobile-brand h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

/* Form Header */
.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.form-header p {
  font-size: 1rem;
  color: #8b949e;
  margin: 0;
}

/* ===== FORM INPUTS ===== */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #c9d1d9;
  margin-left: 4px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 52px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  transition: all 0.2s ease;
}

.input-wrapper:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
}

.input-wrapper.focused {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 143, 56, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 143, 56, 0.1);
}

.input-icon {
  color: #8b949e;
  font-size: 22px;
  transition: color 0.2s ease;
}

.input-wrapper.focused .input-icon {
  color: #ff8f38;
}

.custom-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 1rem;
  height: 100%;
}

.custom-input::placeholder {
  color: #6e7681;
}

.toggle-password {
  background: none;
  border: none;
  color: #8b949e;
  cursor: pointer;
  padding: 4px;
  font-size: 20px;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #c9d1d9;
}

/* ===== OPTIONS ===== */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
}

/* Custom Checkbox */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-wrapper input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkmark::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #ff8f38;
  border-radius: 3px;
  transform: scale(0);
  transition: transform 0.2s ease;
}

.checkbox-wrapper input:checked + .checkmark {
  border-color: #ff8f38;
}

.checkbox-wrapper input:checked + .checkmark::after {
  transform: scale(1);
}

.checkbox-label {
  font-size: 0.9rem;
  color: #c9d1d9;
}

.forgot-link {
  font-size: 0.9rem;
  color: #ff8f38;
  text-decoration: none;
  transition: all 0.2s ease;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* ===== SUBMIT BUTTON ===== */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 54px;
  background: linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%);
  border: none;
  border-radius: 14px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 143, 56, 0.35);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn.loading {
  cursor: wait;
}

.btn-icon {
  font-size: 20px;
  transition: transform 0.2s ease;
}

.submit-btn:hover:not(:disabled) .btn-icon {
  transform: translateX(4px);
}

/* ===== DIVIDER ===== */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
}

.divider span {
  font-size: 0.85rem;
  color: #6e7681;
}

/* ===== SOCIAL LOGIN ===== */
.social-login {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.social-btn img {
  width: 24px;
  height: 24px;
}

.social-btn.apple {
  color: #ffffff;
  font-size: 24px;
}

/* ===== FOOTER ===== */
.form-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.form-footer p {
  font-size: 0.95rem;
  color: #8b949e;
  margin: 0;
}

.signup-link {
  color: #ff8f38;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.signup-link:hover {
  text-decoration: underline;
}

/* ===== VERSION TAG ===== */
.version-tag {
  position: absolute;
  bottom: 24px;
  right: 24px;
}

.version-tag span {
  font-size: 0.75rem;
  color: #484f58;
}

/* ===== ERROR TOAST ===== */
.error-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f85149 0%, #da3633 100%);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.95rem;
  box-shadow: 0 10px 40px rgba(248, 81, 73, 0.3);
  z-index: 1000;
}

.close-toast {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  transition: color 0.2s ease;
}

.close-toast:hover {
  color: #ffffff;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1023px) {
  .login-container {
    flex-direction: column;
    max-width: 480px;
  }

  .brand-section {
    display: none;
  }

  .form-section {
    padding: 40px 32px;
  }

  .mobile-brand {
    display: block;
  }

  .form-header h3 {
    font-size: 1.5rem;
  }

  .floating-shape {
    display: none;
  }

  .version-tag {
    position: static;
    margin-top: 24px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 16px;
  }

  .login-container {
    border-radius: 20px;
    min-height: auto;
  }

  .form-section {
    padding: 32px 24px;
  }

  .form-header h3 {
    font-size: 1.35rem;
  }

  .input-wrapper {
    height: 50px;
  }

  .submit-btn {
    height: 52px;
  }
}
</style>
