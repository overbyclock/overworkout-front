# Componentes Disponibles

## Componentes Quasar Más Usados

| Componente | Uso | Props Importantes |
|------------|-----|-------------------|
| `q-btn` | Botones | `color`, `icon`, `unelevated`, `outline`, `loading` |
| `q-input` | Campos de texto | `v-model`, `label`, `rules`, `outlined`, `type` |
| `q-select` | Selects | `v-model`, `options`, `option-value`, `option-label` |
| `q-table` | Tablas de datos | `columns`, `rows`, `pagination`, `loading` |
| `q-card` | Contenedores | Ninguno especial |
| `q-dialog` | Modales | `model-value`, `persistent` |
| `q-form` | Formularios | `@submit`, `@reset`, `@validation-error` |
| `q-list` + `q-item` | Listas | `clickable`, `v-ripple` |
| `q-icon` | Iconos | `name` (material symbols) |
| `q-toggle` / `q-checkbox` | Switches | `v-model`, `label` |

## Iconos (Material Symbols)

Usar prefijo `sym_o_` para outlined:

```vue
<q-icon name="sym_o_home" />
<q-icon name="sym_o_person" />
<q-icon name="sym_o_settings" />
<q-icon name="sym_o_delete" />
<q-icon name="sym_o_edit" />
```

## Colores del Tema

```vue
<!-- Primario (naranja) -->
<q-btn color="primary" />

<!-- Negativo (rojo) -->
<q-btn color="negative" />

<!-- Positivo (verde) -->
<q-btn color="positive" />

<!-- Info (azul) -->
<q-btn color="info" />

<!-- Warning (amarillo) -->
<q-btn color="warning" />
```

Clases CSS de colores:
```vue
<div class="text-primary">Texto naranja</div>
<div class="bg-dark">Fondo oscuro</div>
<div class="text-negative">Texto error</div>
```

## Componentes Custom del Proyecto

| Componente | Ubicación | Props | Descripción |
|------------|-----------|-------|-------------|
| `AppDialog` | `components/common/` | `title`, `modelValue` | Diálogo base |
| `LoadingSpinner` | `components/common/` | `size` | Spinner centrado |
| `DataTable` | `components/common/` | `columns`, `rows`, `loading` | Tabla con defaults |

## Slots Comunes de Quasar

```vue
<!-- q-table: slot de acciones por fila -->
<q-table :columns="columns" :rows="rows">
  <template #body-cell-actions="{ row }">
    <q-btn icon="sym_o_edit" flat @click="edit(row)" />
    <q-btn icon="sym_o_delete" flat color="negative" @click="remove(row)" />
  </template>
</q-table>

<!-- q-card: slots de header/footer -->
<q-card>
  <q-card-section>
    <div class="text-h6">Título</div>
  </q-card-section>
  
  <q-card-section>Contenido</q-card-section>
  
  <q-card-actions align="right">
    <q-btn label="Cancelar" flat />
    <q-btn label="Guardar" color="primary" />
  </q-card-actions>
</q-card>
```

## Layout Utilities (Quasar)

```vue
<!-- Flexbox -->
<div class="row q-gutter-md">
  <div class="col-6">Mitad</div>
  <div class="col-6">Mitad</div>
</div>

<!-- Espaciado -->
<div class="q-pa-md">Padding medio</div>
<div class="q-ma-sm">Margin pequeño</div>
<div class="q-gutter-md">Gap entre hijos</div>

<!-- Texto -->
<div class="text-h6">Heading 6</div>
<div class="text-body1">Body text</div>
<div class="text-caption">Caption pequeño</div>
<div class="text-center">Centrado</div>
```
