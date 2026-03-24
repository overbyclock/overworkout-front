<template>
  <q-page class="page-container">
    <div v-if="loading" class="loading-state">
      <q-spinner size="60px" color="primary" />
      <p>Cargando programa...</p>
    </div>

    <template v-else-if="program">
      <div class="program-header">
        <div class="header-gradient" :style="{ background: programGradient }">
          <q-btn flat round icon="arrow_back" class="back-btn" @click="goBack" />
          <div class="header-content">
            <div class="program-icon">{{ programIcon }}</div>
            <div class="program-info">
              <h1 class="program-title">{{ program.name }}</h1>
              <p class="program-subtitle">{{ program.description }}</p>
              <div class="program-badges">
                <q-badge :color="program.isActive ? 'positive' : 'grey'" class="q-mr-sm">
                  {{ program.isActive ? 'Activo' : 'Inactivo' }}
                </q-badge>
                <q-badge color="primary" class="q-mr-sm">
                  {{ program.totalLevels }} niveles
                </q-badge>
                <q-badge color="grey-7">
                  ~{{ program.estimatedDurationWeeks }} semanas
                </q-badge>
              </div>
            </div>
            <div class="header-actions">
              <q-btn flat round icon="edit" color="white" @click="editProgram">
                <q-tooltip>Editar programa</q-tooltip>
              </q-btn>
              <q-btn flat round icon="more_vert" color="white">
                <q-menu dark>
                  <q-list style="min-width: 200px; background: #212529;">
                    <q-item clickable v-close-popup @click="duplicateProgram">
                      <q-item-section avatar><q-icon name="content_copy" /></q-item-section>
                      <q-item-section>Duplicar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toggleActive">
                      <q-item-section avatar><q-icon :name="program.isActive ? 'pause' : 'play_arrow'" /></q-item-section>
                      <q-item-section>{{ program.isActive ? 'Desactivar' : 'Activar' }}</q-item-section>
                    </q-item>
                    <q-separator dark />
                    <q-item clickable v-close-popup @click="deleteProgram" class="text-negative">
                      <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                      <q-item-section>Eliminar</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="page-content">
        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-card">
            <q-icon name="people" class="stat-icon" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">Usuarios activos</div>
            </div>
          </div>
          <div class="stat-card">
            <q-icon name="trending_up" class="stat-icon" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.avgProgress }}%</div>
              <div class="stat-label">Progreso medio</div>
            </div>
          </div>
          <div class="stat-card">
            <q-icon name="emoji_events" class="stat-icon" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.completions }}</div>
              <div class="stat-label">Completados</div>
            </div>
          </div>
          <div class="stat-card">
            <q-icon name="schedule" class="stat-icon" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.avgTime }}m</div>
              <div class="stat-label">Tiempo medio/día</div>
            </div>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs-container">
          <div class="tabs-header">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <q-icon :name="tab.icon" size="20px" />
              <span>{{ tab.label }}</span>
              <q-badge v-if="tab.count" color="primary" floating>{{ tab.count }}</q-badge>
            </button>
          </div>

          <!-- Levels Tab -->
          <div v-show="activeTab === 'levels'" class="tab-content">
            <div class="section-header">
              <h2>Niveles del Programa</h2>
              <q-btn color="primary" icon="add" label="Añadir Nivel" @click="addLevel" />
            </div>
            
            <div class="levels-list">
              <div 
                v-for="(level, index) in program.levels" 
                :key="level.id"
                class="level-wrapper"
                :class="{ 'expanded': expandedLevel === level.id }"
              >
                <!-- Tarjeta compacta del nivel -->
                <div 
                  class="level-card-compact"
                  :class="{ 'locked': level.isLockedByDefault }"
                  @click="toggleLevel(level)"
                >
                  <div class="level-main">
                    <div class="level-num">{{ level.levelNumber }}</div>
                    <div class="level-content">
                      <h4>{{ level.name }}</h4>
                      <div class="level-badges">
                        <q-badge v-if="level.requirements?.length" color="grey-8" class="q-mr-sm">
                          <q-icon name="checklist" size="12px" class="q-mr-xs" />
                          {{ level.requirements.length }} requisitos
                        </q-badge>
                        <q-badge v-if="level.isLockedByDefault" color="orange" class="q-mr-sm">
                          <q-icon name="lock" size="12px" class="q-mr-xs" />
                          Bloqueado
                        </q-badge>
                        <q-badge v-if="level.levelNumber === 1" color="primary">
                          <q-icon name="fitness_center" size="12px" class="q-mr-xs" />
                          Entrenamiento completo
                        </q-badge>
                      </div>
                    </div>
                  </div>
                  <div class="level-actions-compact">
                    <q-btn 
                      flat 
                      round 
                      dense
                      :icon="expandedLevel === level.id ? 'expand_less' : 'expand_more'" 
                      color="grey-5"
                    />
                    <q-btn flat round dense icon="edit" color="primary" @click.stop="editLevel(level)">
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                  </div>
                </div>
                
                <!-- Entrenamiento expandible (debajo) -->
                <div v-if="expandedLevel === level.id && level.levelNumber === 1" class="training-expanded">
                  <!-- Header del entrenamiento -->
                  <div class="training-header-compact">
                    <div class="training-title-row">
                      <h3>{{ nivel1Data.name }}</h3>
                      <div class="training-badges">
                        <q-badge color="primary">{{ nivel1Data.durationWeeks }} semanas <span class="text-caption">(incl. Semana 0)</span></q-badge>
                        <q-badge color="secondary">{{ nivel1Data.sessionsPerWeek }} sesiones/semana</q-badge>
                        <q-badge color="accent">{{ nivel1Data.difficulty }}</q-badge>
                        <q-badge color="positive">🔥 Todo nivel principiante</q-badge>
                      </div>
                    </div>
                    <p class="training-desc">{{ nivel1Data.description }}</p>
                  </div>
                  
                  <!-- Tabs de semanas -->
                  <div class="weeks-container">
                    <q-tabs v-model="selectedWeek" dense dark class="week-tabs-compact">
                      <q-tab name="week0" label="SEMANA 0" />
                      <q-tab name="week1" label="SEMANA 1" />
                      <q-tab name="week2" label="SEMANA 2" />
                      <q-tab name="week3" label="SEMANA 3" />
                      <q-tab name="week4" label="TESTS" />
                    </q-tabs>
                    
                    <q-tab-panels v-model="selectedWeek" dark animated class="week-panels-compact">
                      <!-- Semanas 0-3 -->
                      <q-tab-panel name="week0">
                        <div class="week-info-compact">
                          <h4>🌱 {{ nivel1Data.trainingWeeks[0]?.focus }}</h4>
                          <p class="week-tip">{{ nivel1Data.progression.week0 }}</p>
                          <q-banner class="bg-amber-9 text-white q-mt-sm" dense rounded>
                            <template v-slot:avatar>
                              <q-icon name="info" />
                            </template>
                            {{ nivel1Data.trainingWeeks[0]?.note }}
                          </q-banner>
                        </div>
                        
                        <div class="sessions-compact">
                          <div v-for="(sessionKey, idx) in ['day1_push', 'day2_pull', 'day3_legs', 'day4_fullbody']" :key="sessionKey" class="session-box">
                            <div class="session-header-compact">
                              <span class="session-name">{{ nivel1Data.sessions[sessionKey]?.name }} <span class="text-caption text-grey-6">(50% esfuerzo)</span></span>
                              <span class="session-time">{{ nivel1Data.sessions[sessionKey]?.duration }}</span>
                            </div>
                            <div class="muscle-tags">
                              <span v-for="mg in nivel1Data.sessions[sessionKey]?.muscleGroups" :key="mg" class="muscle-tag">{{ mg }}</span>
                            </div>
                            
                            <!-- CIRCUIT FORMAT: Rondas -->
                            <div v-if="nivel1Data.sessions[sessionKey]?.isCircuit" class="circuit-info">
                              <div class="circuit-badge">
                                <q-icon name="repeat" size="18px" class="q-mr-sm" />
                                {{ nivel1Data.sessions[sessionKey]?.circuitConfig?.rounds }} RONDAS
                              </div>
                              <div class="circuit-rest">
                                <span>⏱️ {{ nivel1Data.sessions[sessionKey]?.circuitConfig?.restBetweenExercises }} entre ejercicios</span>
                                <span>• {{ nivel1Data.sessions[sessionKey]?.circuitConfig?.restBetweenRounds }} entre rondas</span>
                              </div>
                            </div>
                            
                            <div class="exercises-compact" :class="{ 'circuit-flow': nivel1Data.sessions[sessionKey]?.isCircuit }">
                              <div v-for="(ex, exIdx) in nivel1Data.sessions[sessionKey]?.exercises" :key="exIdx" class="exercise-row" :class="{ 'circuit-item': nivel1Data.sessions[sessionKey]?.isCircuit }">
                                <div class="exercise-info">
                                  <div class="exercise-header-row">
                                    <!-- Flecha de flujo para circuito -->
                                    <q-icon v-if="nivel1Data.sessions[sessionKey]?.isCircuit && exIdx > 0" name="arrow_downward" size="14px" color="primary" class="flow-arrow" />
                                    <span class="exercise-number" v-if="nivel1Data.sessions[sessionKey]?.isCircuit">{{ exIdx + 1 }}.</span>
                                    <span class="exercise-name-compact">{{ ex.name }}</span>
                                    <!-- Fuegos de dificultad -->
                                    <span class="difficulty-flames" :class="'difficulty-' + (ex.difficulty || 1)">
                                      <q-icon v-for="n in (ex.difficulty || 1)" :key="n" name="local_fire_department" size="12px" />
                                    </span>
                                    <!-- Badge con ID de la BBDD -->
                                    <q-badge v-if="ex.id" color="grey-8" size="xs" class="q-ml-sm">ID:{{ ex.id }}</q-badge>
                                  </div>
                                  <!-- Stats según formato -->
                                  <span v-if="nivel1Data.sessions[sessionKey]?.isCircuit" class="exercise-stats circuit-stats">{{ ex.reps }} <span class="text-caption text-amber">→ mitad reps Semana 0</span></span>
                                  <span v-else class="exercise-stats">{{ ex.sets }}x{{ ex.reps }} • {{ ex.rest }}</span>
                                </div>
                                <q-btn flat round dense icon="play_circle" size="xs" color="grey-6" @click="searchVideo(ex.videoSearch)">
                                  <q-tooltip>Ver video</q-tooltip>
                                </q-btn>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-tab-panel>
                      
                      <!-- Semanas 1-3 -->
                      <q-tab-panel v-for="weekNum in [1,2,3]" :key="weekNum" :name="`week${weekNum}`">
                        <div class="week-info-compact">
                          <h4>{{ nivel1Data.trainingWeeks[weekNum]?.focus }}</h4>
                          <p class="week-tip">{{ nivel1Data.progression[`week${weekNum}`] }}</p>
                        </div>
                        
                        <div class="sessions-compact">
                          <div v-for="(sessionKey, idx) in ['day1_push', 'day2_pull', 'day3_legs', 'day4_fullbody']" :key="sessionKey" class="session-box">
                            <div class="session-header-compact">
                              <span class="session-name">{{ nivel1Data.sessions[sessionKey]?.name }}</span>
                              <span class="session-time">{{ nivel1Data.sessions[sessionKey]?.duration }}</span>
                            </div>
                            <div class="muscle-tags">
                              <span v-for="mg in nivel1Data.sessions[sessionKey]?.muscleGroups" :key="mg" class="muscle-tag">{{ mg }}</span>
                            </div>
                            
                            <!-- CIRCUIT FORMAT: Rondas -->
                            <div v-if="nivel1Data.sessions[sessionKey]?.isCircuit" class="circuit-info">
                              <div class="circuit-badge">
                                <q-icon name="repeat" size="18px" class="q-mr-sm" />
                                {{ nivel1Data.sessions[sessionKey]?.circuitConfig?.rounds }} RONDAS
                              </div>
                              <div class="circuit-rest">
                                <span>⏱️ {{ nivel1Data.sessions[sessionKey]?.circuitConfig?.restBetweenExercises }} entre ejercicios</span>
                                <span>• {{ nivel1Data.sessions[sessionKey]?.circuitConfig?.restBetweenRounds }} entre rondas</span>
                              </div>
                            </div>
                            
                            <div class="exercises-compact" :class="{ 'circuit-flow': nivel1Data.sessions[sessionKey]?.isCircuit }">
                              <div v-for="(ex, exIdx) in nivel1Data.sessions[sessionKey]?.exercises" :key="exIdx" class="exercise-row" :class="{ 'circuit-item': nivel1Data.sessions[sessionKey]?.isCircuit }">
                                <div class="exercise-info">
                                  <div class="exercise-header-row">
                                    <!-- Flecha de flujo para circuito -->
                                    <q-icon v-if="nivel1Data.sessions[sessionKey]?.isCircuit && exIdx > 0" name="arrow_downward" size="14px" color="primary" class="flow-arrow" />
                                    <span class="exercise-number" v-if="nivel1Data.sessions[sessionKey]?.isCircuit">{{ exIdx + 1 }}.</span>
                                    <span class="exercise-name-compact">{{ ex.name }}</span>
                                    <!-- Fuegos de dificultad -->
                                    <span class="difficulty-flames" :class="'difficulty-' + (ex.difficulty || 1)">
                                      <q-icon v-for="n in (ex.difficulty || 1)" :key="n" name="local_fire_department" size="12px" />
                                    </span>
                                    <!-- Badge con ID de la BBDD -->
                                    <q-badge v-if="ex.id" color="grey-8" size="xs" class="q-ml-sm">ID:{{ ex.id }}</q-badge>
                                  </div>
                                  <!-- Stats según formato -->
                                  <span v-if="nivel1Data.sessions[sessionKey]?.isCircuit" class="exercise-stats circuit-stats">{{ ex.reps }}</span>
                                  <span v-else class="exercise-stats">{{ ex.sets }}x{{ ex.reps }} • {{ ex.rest }}</span>
                                </div>
                                <q-btn flat round dense icon="play_circle" size="xs" color="grey-6" @click="searchVideo(ex.videoSearch)">
                                  <q-tooltip>Ver video</q-tooltip>
                                </q-btn>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-tab-panel>
                      
                      <!-- Semana 4: Tests -->
                      <q-tab-panel name="week4">
                        <div class="tests-compact">
                          <h4>{{ nivel1Data.testWeek.name }}</h4>
                          <p class="tests-desc">{{ nivel1Data.testWeek.tests.description }}</p>
                          
                          <div class="tests-list">
                            <div v-for="(test, idx) in nivel1Data.testWeek.tests.requirements" :key="idx" class="test-item">
                              <div class="test-info">
                                <span class="test-name-compact">{{ test.name }}</span>
                                <span class="test-minimum">Mín: {{ test.minimum }} {{ test.unit }}</span>
                              </div>
                              <span class="test-target">Obj: {{ test.target }} {{ test.unit }}</span>
                            </div>
                          </div>
                        </div>
                      </q-tab-panel>
                    </q-tab-panels>
                  </div>
                  
                  <!-- Tips -->
                  <div class="tips-compact">
                    <h5>💡 Consejos</h5>
                    <ul>
                      <li v-for="(tip, idx) in nivel1Data.tips" :key="idx">{{ tip }}</li>
                    </ul>
                  </div>
                </div>
                
                <!-- Mensaje para otros niveles -->
                <div v-else-if="expandedLevel === level.id" class="level-simple-detail">
                  <p>{{ level.description || 'Sin descripción detallada' }}</p>
                  <div class="simple-actions">
                    <q-btn flat color="primary" icon="edit" label="Editar nivel" @click="editLevel(level)" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Users Tab -->
          <div v-show="activeTab === 'users'" class="tab-content">
            <div class="section-header">
              <h2>Usuarios en el Programa</h2>
              <div class="header-actions-inline">
                <q-input 
                  v-model="userSearch" 
                  placeholder="Buscar usuario..." 
                  dense 
                  outlined 
                  dark 
                  class="search-input"
                >
                  <template v-slot:prepend><q-icon name="search" /></template>
                </q-input>
                <q-btn color="primary" icon="person_add" label="Añadir Usuario" @click="addUser" />
              </div>
            </div>

            <q-table
              :rows="programUsers"
              :columns="userColumns"
              row-key="id"
              flat
              dark
              :pagination="{ rowsPerPage: 10 }"
              class="users-table"
            >
              <template v-slot:body-cell-avatar="{ row }">
                <q-td>
                  <q-avatar size="40px" color="primary" text-color="white">
                    {{ row.initials }}
                  </q-avatar>
                </q-td>
              </template>
              <template v-slot:body-cell-progress="{ row }">
                <q-td>
                  <div class="progress-cell">
                    <q-linear-progress 
                      :value="row.progress / 100" 
                      size="8px" 
                      rounded 
                      color="primary" 
                      track-color="grey-8"
                      class="progress-bar"
                    />
                    <span class="progress-text">{{ row.progress }}%</span>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-level="{ row }">
                <q-td>
                  <q-badge :color="getLevelColor(row.currentLevel)" class="level-badge">
                    Nivel {{ row.currentLevel }}
                  </q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-status="{ row }">
                <q-td>
                  <q-badge :color="row.status === 'active' ? 'positive' : 'grey'">
                    {{ row.status === 'active' ? 'Activo' : 'Pausado' }}
                  </q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="{ row }">
                <q-td class="text-right">
                  <q-btn flat round icon="visibility" size="sm" @click="viewUser(row)" />
                  <q-btn flat round icon="edit" size="sm" @click="editUser(row)" />
                </q-td>
              </template>
            </q-table>
          </div>

          <!-- Skills Tab -->
          <div v-show="activeTab === 'skills'" class="tab-content">
            <div class="section-header">
              <h2>Skills del Programa</h2>
              <q-btn color="primary" icon="add" label="Añadir Skill" @click="addSkill" />
            </div>

            <div class="skills-grid">
              <div v-for="family in skillFamilies" :key="family.name" class="skill-family">
                <h3 class="family-title">{{ family.label }}</h3>
                <div class="family-skills">
                  <div 
                    v-for="skill in family.skills" 
                    :key="skill.id"
                    class="skill-card"
                    :class="{ 'locked': skill.levelRequired > 1 }"
                    @click="viewSkill(skill)"
                  >
                    <div class="skill-icon">{{ skill.icon || '🎯' }}</div>
                    <div class="skill-info">
                      <h4>{{ skill.name }}</h4>
                      <p>Nivel {{ skill.levelRequired }} requerido</p>
                    </div>
                    <q-icon 
                      :name="skill.levelRequired > 1 ? 'lock' : 'check_circle'" 
                      :color="skill.levelRequired > 1 ? 'grey' : 'positive'"
                      size="20px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Achievements Tab -->
          <div v-show="activeTab === 'achievements'" class="tab-content">
            <div class="section-header">
              <h2>Logros del Programa</h2>
              <q-btn color="primary" icon="add" label="Crear Logro" @click="addAchievement" />
            </div>

            <div class="achievements-grid">
              <div 
                v-for="achievement in achievements" 
                :key="achievement.id"
                class="achievement-card"
                :class="achievement.category"
              >
                <div class="achievement-icon">{{ achievement.icon }}</div>
                <div class="achievement-info">
                  <h4>{{ achievement.name }}</h4>
                  <p>{{ achievement.description }}</p>
                  <div class="achievement-meta">
                    <q-badge :color="getCategoryColor(achievement.category)">
                      {{ achievement.category }}
                    </q-badge>
                    <span class="xp-badge">+{{ achievement.xpReward }} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Tab -->
          <div v-show="activeTab === 'analytics'" class="tab-content">
            <div class="section-header">
              <h2>Analíticas del Programa</h2>
              <q-select 
                v-model="timeRange" 
                :options="timeOptions" 
                dense 
                outlined 
                dark 
                style="width: 150px;"
              />
            </div>

            <div class="analytics-grid">
              <div class="chart-card large">
                <h4>Progreso de Usuarios por Mes</h4>
                <div class="chart-placeholder">
                  <div class="chart-bars">
                    <div v-for="(bar, i) in progressChart" :key="i" class="bar-wrapper">
                      <div class="bar" :style="{ height: bar.value + '%' }"></div>
                      <span class="bar-label">{{ bar.month }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="chart-card">
                <h4>Distribución por Nivel</h4>
                <div class="pie-placeholder">
                  <div class="pie-chart" :style="pieChartStyle"></div>
                  <div class="pie-legend">
                    <div v-for="(slice, i) in pieData" :key="i" class="legend-item">
                      <span class="dot" :style="{ background: slice.color }"></span>
                      <span>Nivel {{ slice.level }}</span>
                      <span class="percent">{{ slice.percent }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="chart-card">
                <h4>Skills Desbloqueados</h4>
                <div class="stats-list">
                  <div v-for="stat in skillStats" :key="stat.name" class="stat-row">
                    <span class="stat-name">{{ stat.name }}</span>
                    <div class="stat-bar">
                      <div class="stat-fill" :style="{ width: stat.value + '%' }"></div>
                    </div>
                    <span class="stat-value">{{ stat.count }}</span>
                  </div>
                </div>
              </div>

              <div class="chart-card wide">
                <h4>Completados vs Abandonos</h4>
                <div class="completion-stats">
                  <div class="completion-item success">
                    <q-icon name="check_circle" size="48px" color="positive" />
                    <div>
                      <div class="completion-value">{{ stats.completions }}</div>
                      <div class="completion-label">Completados</div>
                    </div>
                  </div>
                  <div class="completion-item warning">
                    <q-icon name="pause_circle" size="48px" color="warning" />
                    <div>
                      <div class="completion-value">{{ stats.paused }}</div>
                      <div class="completion-label">Pausados</div>
                    </div>
                  </div>
                  <div class="completion-item negative">
                    <q-icon name="cancel" size="48px" color="negative" />
                    <div>
                      <div class="completion-value">{{ stats.dropped }}</div>
                      <div class="completion-label">Abandonados</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Not Found -->
    <div v-else class="not-found">
      <q-icon name="error_outline" size="80px" color="grey-6" />
      <h2>Programa no encontrado</h2>
      <q-btn color="primary" label="Volver a Programas" @click="goBack" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import nivel1Fundamentos from '@/data/calistenia-master-program'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const program = ref(null)
const activeTab = ref('levels')
const userSearch = ref('')
const timeRange = ref('Últimos 6 meses')
const expandedLevel = ref(null)
const selectedWeek = ref('week0')
const nivel1Data = ref(nivel1Fundamentos)

const tabs = [
  { id: 'levels', label: 'Niveles', icon: 'stairs', count: 12 },
  { id: 'users', label: 'Usuarios', icon: 'people', count: 156 },
  { id: 'skills', label: 'Skills', icon: 'emoji_events', count: 18 },
  { id: 'achievements', label: 'Logros', icon: 'military_tech', count: 29 },
  { id: 'analytics', label: 'Analíticas', icon: 'analytics' },
]

const timeOptions = ['Último mes', 'Últimos 3 meses', 'Últimos 6 meses', 'Último año', 'Todo']

const stats = ref({
  totalUsers: 156,
  avgProgress: 42,
  completions: 23,
  avgTime: 45,
  paused: 12,
  dropped: 8
})

const programGradient = computed(() => {
  const colors = {
    'calisthenics': 'linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%)',
    'crossfit': 'linear-gradient(135deg, #38b2ac 0%, #4299e1 100%)',
  }
  return colors[program.value?.discipline] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
})

const programIcon = computed(() => {
  const icons = { 'calisthenics': '🤸', 'crossfit': '🏋️', 'fitness': '💪' }
  return icons[program.value?.discipline] || '🎯'
})

const userColumns = [
  { name: 'avatar', label: '', field: 'avatar', align: 'center' },
  { name: 'name', label: 'Usuario', field: 'name', align: 'left', sortable: true },
  { name: 'level', label: 'Nivel Actual', field: 'currentLevel', align: 'center', sortable: true },
  { name: 'progress', label: 'Progreso', field: 'progress', align: 'center', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'joined', label: 'Ingreso', field: 'joinedAt', align: 'center', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const programUsers = ref([
  { id: 1, name: 'Juan Pérez', initials: 'JP', currentLevel: 5, progress: 65, status: 'active', joinedAt: '2025-01-15' },
  { id: 2, name: 'María García', initials: 'MG', currentLevel: 8, progress: 82, status: 'active', joinedAt: '2024-11-20' },
  { id: 3, name: 'Carlos López', initials: 'CL', currentLevel: 3, progress: 30, status: 'paused', joinedAt: '2025-02-01' },
])

const skillFamilies = ref([
  { 
    name: 'handstand', 
    label: 'Handstand Family',
    skills: [
      { id: 1, name: 'Handstand Wall', levelRequired: 1, icon: '🤸' },
      { id: 2, name: 'Free Handstand', levelRequired: 5, icon: '🤸' },
      { id: 3, name: 'Handstand Push-up', levelRequired: 8, icon: '💪' },
    ]
  },
  { 
    name: 'muscleup', 
    label: 'Muscle-up Family',
    skills: [
      { id: 4, name: 'Muscle-up Progression', levelRequired: 3, icon: '💪' },
      { id: 5, name: 'Full Muscle-up', levelRequired: 6, icon: '🏆' },
      { id: 6, name: 'Muscle-up L-sit', levelRequired: 9, icon: '⭐' },
    ]
  },
])

const achievements = ref([
  { id: 1, name: 'Primeros Pasos', description: 'Completa el nivel 1', category: 'progress', icon: '🎯', xpReward: 100 },
  { id: 2, name: 'Handstand Master', description: 'Desbloquea el handstand libre', category: 'skill', icon: '🤸', xpReward: 500 },
  { id: 3, name: 'Constancia', description: 'Entrena 7 días seguidos', category: 'consistency', icon: '🔥', xpReward: 200 },
])

const progressChart = [
  { month: 'Ene', value: 30 },
  { month: 'Feb', value: 45 },
  { month: 'Mar', value: 40 },
  { month: 'Abr', value: 55 },
  { month: 'May', value: 60 },
  { month: 'Jun', value: 75 },
]

const pieData = [
  { level: '1-3', percent: 35, color: '#ff8f38' },
  { level: '4-6', percent: 28, color: '#38b2ac' },
  { level: '7-9', percent: 22, color: '#9f7aea' },
  { level: '10-12', percent: 15, color: '#ed64a6' },
]

const pieChartStyle = computed(() => {
  let gradient = 'conic-gradient('
  let currentDeg = 0
  pieData.forEach(slice => {
    const deg = (slice.percent / 100) * 360
    gradient += `${slice.color} ${currentDeg}deg ${currentDeg + deg}deg, `
    currentDeg += deg
  })
  gradient = gradient.slice(0, -2) + ')'
  return { background: gradient }
})

const skillStats = [
  { name: 'Handstand Wall', value: 85, count: 132 },
  { name: 'Muscle-up', value: 45, count: 70 },
  { name: 'Front Lever', value: 25, count: 39 },
]

const fetchProgram = async () => {
  loading.value = true
  try {
    // Simulamos carga de API
    await new Promise(r => setTimeout(r, 800))
    program.value = {
      id: route.params.id,
      name: 'Calistenia Master',
      slug: 'calisthenia-master',
      description: 'Programa completo de calistenia desde cero hasta nivel experto. 12 niveles progresivos con evaluaciones y desbloqueo de skills.',
      discipline: 'calisthenics',
      totalLevels: 12,
      estimatedDurationWeeks: 144,
      isActive: true,
      levels: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        levelNumber: i + 1,
        name: ['Novato Absoluto', 'Principiante', 'Aprendiz', 'Intermedio', 'Avanzado', 'Experto', 'Elite', 'Master', 'Grand Master', 'Legendario', 'Divino', 'Titán'][i],
        description: `Nivel ${i + 1} del programa`,
        isLockedByDefault: i > 0,
        requirements: [{ id: 1 }, { id: 2 }]
      }))
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar el programa' })
  } finally {
    loading.value = false
  }
}

const getLevelColor = (level) => {
  if (level <= 3) return 'positive'
  if (level <= 6) return 'primary'
  if (level <= 9) return 'warning'
  return 'accent'
}

const getCategoryColor = (category) => {
  const colors = { progress: 'positive', skill: 'primary', consistency: 'warning', volume: 'accent', social: 'info' }
  return colors[category] || 'grey'
}

const goBack = () => router.push('/admin/training-programs')
const editProgram = () => router.push(`/admin/training-programs/${program.value.id}/edit`)
const viewLevel = (level) => router.push(`/admin/training-levels/${level.id}/edit`)
const editLevel = (level) => router.push(`/admin/training-levels/${level.id}/edit`)

const toggleLevel = (level) => {
  if (expandedLevel.value === level.id) {
    expandedLevel.value = null
  } else {
    expandedLevel.value = level.id
  }
}

const searchVideo = (query) => {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  window.open(url, '_blank')
}
const viewSkill = (skill) => router.push(`/admin/training-skills/${skill.id}`)
const viewUser = (user) => router.push(`/admin/user-progress/${user.id}`)
const editUser = (user) => router.push(`/admin/users/${user.id}/edit`)

const addLevel = () => router.push(`/admin/training-programs/${program.value.id}/levels/create`)
const addUser = () => { /* TODO */ }
const addSkill = () => router.push('/admin/training-skills/create')
const addAchievement = () => router.push('/admin/achievements/create')

const duplicateProgram = () => { $q.notify({ message: 'Programa duplicado' }) }
const toggleActive = () => { 
  program.value.isActive = !program.value.isActive
  $q.notify({ message: program.value.isActive ? 'Programa activado' : 'Programa desactivado' }) 
}
const deleteProgram = () => { $q.notify({ message: 'Programa eliminado' }); goBack() }

onMounted(fetchProgram)
</script>

<style scoped>
.program-header {
  margin: -24px -24px 24px -24px;
}

.header-gradient {
  position: relative;
  padding: 40px;
  min-height: 280px;
  display: flex;
  align-items: flex-end;
}

.back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  color: white;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  align-items: flex-end;
  gap: 30px;
  width: 100%;
}

.program-icon {
  font-size: 100px;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.3));
}

.program-info {
  flex: 1;
  color: white;
}

.program-title {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 12px;
  text-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.program-subtitle {
  font-size: 16px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 0 20px;
  line-height: 1.6;
}

.program-badges {
  display: flex;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-icon {
  font-size: 40px;
  color: #ff8f38;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #8b949e;
  margin-top: 4px;
}

/* Tabs */
.tabs-container {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 20px 0;
  gap: 8px;
}

.tab-btn {
  background: none;
  border: none;
  color: #8b949e;
  padding: 16px 24px 20px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  transition: all 0.3s;
  margin-top: 8px;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  color: #ff8f38;
}

.tab-btn .q-badge {
  position: relative;
  top: -8px;
  margin-left: 4px;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 3px;
  background: #ff8f38;
  border-radius: 3px 3px 0 0;
}

.tab-content {
  padding: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.header-actions-inline {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 280px;
}

/* Levels Timeline */
.levels-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.level-item {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.level-number {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  flex-shrink: 0;
}

.level-item.unlocked .level-number {
  background: linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%);
  color: #fff;
}

.level-item.locked .level-number {
  background: #21262d;
  color: #8b949e;
}

.level-card {
  flex: 1;
  background: #0d1117;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.level-card:hover {
  border-color: rgba(255, 143, 56, 0.3);
  background: #161b22;
}

.level-item.locked .level-card {
  opacity: 0.7;
}

.level-info {
  flex: 1;
}

.level-info h4 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 6px;
}

.level-info p {
  font-size: 14px;
  color: #8b949e;
  margin: 0 0 12px;
}

.level-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #8b949e;
}

.level-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.level-actions {
  display: flex;
  gap: 8px;
}

/* Users Table */
.users-table {
  background: transparent;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 150px;
}

.progress-bar {
  flex: 1;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #ff8f38;
  min-width: 40px;
}

.level-badge {
  padding: 4px 12px;
  font-weight: 600;
}

/* Skills Grid */
.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.skill-family {
  background: #0d1117;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.family-title {
  font-size: 18px;
  font-weight: 700;
  color: #ff8f38;
  margin: 0 0 16px;
}

.family-skills {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #161b22;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.skill-card:hover {
  border-color: rgba(255, 143, 56, 0.3);
}

.skill-card.locked {
  opacity: 0.6;
}

.skill-icon {
  font-size: 32px;
}

.skill-info {
  flex: 1;
}

.skill-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
}

.skill-info p {
  font-size: 13px;
  color: #8b949e;
  margin: 0;
}

/* Achievements */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.achievement-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #0d1117;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.achievement-icon {
  font-size: 40px;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 6px;
}

.achievement-info p {
  font-size: 13px;
  color: #8b949e;
  margin: 0 0 12px;
}

.achievement-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.xp-badge {
  background: rgba(255, 143, 56, 0.2);
  color: #ff8f38;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Analytics */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.chart-card {
  background: #0d1117;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.chart-card.large {
  grid-row: span 2;
}

.chart-card.wide {
  grid-column: span 2;
}

.chart-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 40px;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  gap: 20px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.bar {
  width: 100%;
  max-width: 60px;
  background: linear-gradient(180deg, #ff8f38 0%, #ff6b6b 100%);
  border-radius: 8px 8px 0 0;
  min-height: 20px;
  transition: height 0.5s ease;
}

.bar-label {
  font-size: 12px;
  color: #8b949e;
}

.pie-placeholder {
  display: flex;
  gap: 24px;
  align-items: center;
}

.pie-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.pie-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #8b949e;
}

.legend-item .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-item .percent {
  margin-left: auto;
  font-weight: 600;
  color: #fff;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-name {
  width: 140px;
  font-size: 14px;
  color: #8b949e;
}

.stat-bar {
  flex: 1;
  height: 8px;
  background: #21262d;
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff8f38 0%, #ff6b6b 100%);
  border-radius: 4px;
}

.stat-value {
  width: 40px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.completion-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.completion-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #161b22;
  border-radius: 16px;
}

.completion-value {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
}

.completion-label {
  font-size: 14px;
  color: #8b949e;
}

/* Loading & Not Found */
.loading-state, .not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #8b949e;
}

.not-found h2 {
  color: #fff;
  margin: 24px 0;
}

@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card.large, .chart-card.wide {
    grid-column: span 1;
    grid-row: span 1;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .program-title {
    font-size: 28px;
  }
}

/* Nuevo diseño compacto de niveles */
.levels-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-wrapper {
  background: #1c2128;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  transition: all 0.3s;
}

.level-wrapper:hover {
  border-color: rgba(255, 143, 56, 0.3);
}

.level-wrapper.expanded {
  border-color: #ff8f38;
}

/* Tarjeta compacta del nivel */
.level-card-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  background: transparent;
  transition: background 0.2s;
}

.level-card-compact:hover {
  background: rgba(255, 255, 255, 0.02);
}

.level-card-compact.locked {
  opacity: 0.7;
}

.level-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.level-num {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: #fff;
}

.level-card-compact.locked .level-num {
  background: #21262d;
  color: #8b949e;
}

.level-content h4 {
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 6px;
}

.level-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.level-actions-compact {
  display: flex;
  gap: 8px;
}

/* Entrenamiento expandido (debajo) */
.training-expanded {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: #0d1117;
}

.training-header-compact {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.training-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.training-title-row h3 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.training-badges {
  display: flex;
  gap: 8px;
}

.training-desc {
  color: #8b949e;
  margin: 0;
  font-size: 14px;
}

/* Tabs de semanas */
.weeks-container {
  padding: 20px;
}

.week-tabs-compact {
  background: #161b22;
  border-radius: 10px;
  margin-bottom: 16px;
}

.week-tabs-compact .q-tab {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.week-panels-compact {
  background: transparent;
}

.week-panels-compact .q-tab-panel {
  padding: 0;
}

.week-info-compact {
  margin-bottom: 16px;
}

.week-info-compact h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
}

.week-tip {
  color: #8b949e;
  font-size: 13px;
  font-style: italic;
  margin: 0;
}

/* Sesiones compactas */
.sessions-compact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.session-box {
  background: #1c2128;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.session-header-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.session-name {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.session-time {
  font-size: 12px;
  color: #8b949e;
  background: rgba(255, 143, 56, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.muscle-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.muscle-tag {
  font-size: 10px;
  text-transform: uppercase;
  color: #8b949e;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
}

.exercises-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exercise-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.exercise-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.exercise-name-compact {
  font-size: 13px;
  color: #c9d1d9;
}

.exercise-stats {
  font-size: 11px;
  color: #6e7681;
}

/* Circuit / Rondas */
.circuit-info {
  background: linear-gradient(135deg, rgba(255, 143, 56, 0.15) 0%, rgba(255, 107, 107, 0.1) 100%);
  border: 1px solid rgba(255, 143, 56, 0.3);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
}

.circuit-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #ff8f38;
  margin-bottom: 6px;
}

.circuit-rest {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 11px;
  color: #8b949e;
}

.circuit-flow {
  position: relative;
}

.circuit-item {
  position: relative;
  background: rgba(255, 143, 56, 0.05);
  border: 1px solid rgba(255, 143, 56, 0.1);
}

.exercise-header-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.flow-arrow {
  position: absolute;
  left: -18px;
  top: -14px;
  background: #0d1117;
  padding: 2px;
  border-radius: 50%;
}

.exercise-number {
  font-size: 11px;
  font-weight: 700;
  color: #ff8f38;
  min-width: 16px;
}

.circuit-stats {
  color: #ff8f38;
  font-weight: 500;
}

/* Badge de ID del ejercicio */
.exercise-name-compact + .q-badge {
  font-size: 9px;
  font-weight: 600;
  opacity: 0.7;
}

/* Fuegos de dificultad */
.difficulty-flames {
  display: inline-flex;
  gap: 1px;
  margin-left: 6px;
}

.difficulty-flames .q-icon {
  color: #ff6b6b;
}

.difficulty-1 .q-icon {
  color: #4ade80; /* Verde - Fácil */
}

.difficulty-2 .q-icon {
  color: #fb923c; /* Naranja - Medio */
}

.difficulty-3 .q-icon {
  color: #ef4444; /* Rojo - Difícil */
}

/* Tests compactos */
.tests-compact {
  padding: 4px;
}

.tests-compact h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
}

.tests-desc {
  color: #8b949e;
  font-size: 13px;
  margin-bottom: 16px;
}

.tests-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.test-item {
  background: #1c2128;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.test-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-name-compact {
  font-weight: 600;
  color: #fff;
  font-size: 13px;
}

.test-minimum {
  font-size: 11px;
  color: #ff8f38;
}

.test-target {
  font-size: 12px;
  color: #3fb950;
  font-weight: 500;
}

/* Tips compactos */
.tips-compact {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 143, 56, 0.03);
}

.tips-compact h5 {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 10px;
}

.tips-compact ul {
  margin: 0;
  padding-left: 18px;
  color: #8b949e;
  font-size: 13px;
}

.tips-compact li {
  margin-bottom: 6px;
}

/* Detalle simple para otros niveles */
.level-simple-detail {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: #8b949e;
}

.simple-actions {
  margin-top: 12px;
}

@media (max-width: 768px) {
  .tabs-header {
    overflow-x: auto;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .level-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .completion-stats {
    grid-template-columns: 1fr;
  }
  
  .level-training-detail {
    margin-left: 0;
  }
  
  .sessions-grid {
    grid-template-columns: 1fr;
  }
  
  .prep-sessions,
  .tests-grid {
    grid-template-columns: 1fr;
  }
}
</style>
