<template>
  <q-page class="dashboard-page">
    <div class="q-pa-lg">
      <h4 class="text-white q-mb-lg">Dashboard</h4>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section>
              <div class="stat-icon">
                <q-icon name="people" size="2rem" style="color: var(--color-primary)" />
              </div>
              <div class="stat-number">1,234</div>
              <div class="stat-label">Total Usuarios</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>

</script>

<style scoped>
.dashboard-page {
  background-color: var(--color-dark);
  min-height: 100vh;
}

.stat-card {
  background-color: var(--color-secondary);
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #a7acb1;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
