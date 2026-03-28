<template>
  <div class="nav-section">
    <div class="nav-section-header">
      <span class="nav-section-title">{{ title }}</span>
    </div>
    <nav class="nav-menu">
      <router-link v-for="item in items" :key="item.route" :to="{ name: item.route }" class="nav-link"
        :class="{ active: activeRoute === item.route }">
        <div class="nav-link-icon">
          <q-icon :name="item.icon" size="22px" />
        </div>
        <span class="nav-link-label">{{ item.label }}</span>
        <q-badge v-if="item.badge" :label="item.badge" color="primary" rounded class="nav-badge" />
        <div v-if="activeRoute === item.route" class="active-indicator"></div>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
  activeRoute: { type: String, default: '' }
})
</script>

<style scoped>
.nav-section {
  padding: 8px 0;
}

.nav-section-header {
  padding: 20px 24px 12px;
}

.nav-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-menu {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #8b949e;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #c9d1d9;
}

.nav-link.active {
  background: rgba(255, 143, 56, 0.12);
  color: #ff8f38;
}

.nav-link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  transition: all 0.2s ease;
}

.nav-link.active .nav-link-icon {
  transform: scale(1.1);
}

.nav-link-label {
  font-size: 0.95rem;
  font-weight: 500;
  flex: 1;
}

.nav-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 10px;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, #ff8f38 0%, #e67e2e 100%);
  border-radius: 0 3px 3px 0;
}
</style>
