<template>
  <div class="mobile-view mobile-view--no-nav welcome-view">
    <div class="welcome-content animate-fadeInUp">
      <div class="welcome-logo">
        <div class="welcome-logo__icon">
          <q-icon name="fitness_center" size="64px" />
        </div>
      </div>

      <h1 class="welcome-title">
        Bienvenido a <br />
        <span class="text-gradient-primary">OverWorkout</span>
      </h1>

      <p class="welcome-subtitle">
        Tu compañero de entrenamiento personal. Te guiaremos paso a paso para que alcances tus
        objetivos.
      </p>

      <ul class="welcome-features">
        <li class="welcome-feature">
          <div class="welcome-feature__icon">
            <q-icon name="sports_gymnastics" size="24px" />
          </div>
          <div>
            <strong>Entrenamientos guiados</strong>
            <p>Paso a paso, sin dudas</p>
          </div>
        </li>
        <li class="welcome-feature">
          <div class="welcome-feature__icon">
            <q-icon name="trending_up" size="24px" />
          </div>
          <div>
            <strong>Progresión inteligente</strong>
            <p>Niveles adaptados a tu evolución</p>
          </div>
        </li>
        <li class="welcome-feature">
          <div class="welcome-feature__icon">
            <q-icon name="emoji_events" size="24px" />
          </div>
          <div>
            <strong>Logros y recompensas</strong>
            <p>Mantén la motivación</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="welcome-actions animate-fadeInUp" style="animation-delay: 0.2s">
      <button class="btn-mobile btn-mobile--large btn-mobile--primary" @click="startOnboarding">
        Empezar ahora
        <q-icon name="arrow_forward" size="20px" />
      </button>
      <button class="btn-mobile btn-mobile--ghost" @click="exploreContent">
        Explorar contenido
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { STORAGE_KEYS } from '@/utils/constants'

const router = useRouter()

const startOnboarding = () => {
  router.push({ name: 'user-onboarding-goal' })
}

const exploreContent = () => {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_SKIPPED, 'true')
  router.push({ name: 'user-explore' })
}
</script>

<style scoped>
.welcome-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  min-height: 100dvh;
  padding: var(--space-8) var(--space-5);
  padding-top: calc(var(--space-10) + var(--safe-top));
  background: radial-gradient(ellipse at top, rgba(255, 143, 56, 0.08) 0%, transparent 60%);
}

.welcome-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.welcome-logo {
  margin-bottom: var(--space-8);
}

.welcome-logo__icon {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-glow-primary);
  animation: bounce-subtle 3s ease-in-out infinite;
}

.welcome-title {
  font-size: var(--font-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-4) 0;
  line-height: var(--leading-tight);
}

.welcome-subtitle {
  font-size: var(--font-lg);
  color: var(--text-secondary);
  margin: 0 0 var(--space-8) 0;
  max-width: 320px;
  line-height: var(--leading-relaxed);
}

.welcome-features {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  text-align: left;
}

.welcome-feature {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

.welcome-feature__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: rgba(255, 143, 56, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.welcome-feature strong {
  color: var(--text-primary);
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  display: block;
  margin-bottom: 2px;
}

.welcome-feature p {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  margin: 0;
}

.welcome-actions {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-bottom: calc(var(--space-6) + var(--safe-bottom));
}
</style>
