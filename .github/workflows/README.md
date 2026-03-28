# CI/CD - Guía de Uso

Este proyecto incluye pipelines de CI/CD con GitHub Actions.

## 🚀 Workflows Disponibles

### 1. `ci.yml` - Integración Continua

Se ejecuta en cada push a `main` o `develop`, y en cada Pull Request.

**Qué hace:**
1. ✅ Verifica el formato del código (ESLint + Prettier)
2. ✅ Ejecuta los 116 tests unitarios
3. ✅ Hace build de producción
4. 📦 Guarda el build como artifact (descargable)

**Para qué sirve:**
- Detectar errores automáticamente antes de mergear
- Asegurar que el código sigue los estándares del proyecto
- Tener un build listo para descargar en cada commit

### 2. `deploy.yml` - Deploy Continuo

Se ejecuta automáticamente cuando haces push a `main`.

**Qué hace:**
1. Construye el proyecto
2. Lo sube a GitHub Pages automáticamente

**Para qué sirve:**
- Tu app estará siempre actualizada en: `https://[tu-usuario].github.io/overworkout-front`
- Deploy automático con cada push a main

---

## 📋 Configuración Inicial

### Paso 1: Activar GitHub Pages

1. Ve a Settings → Pages en tu repositorio
2. Source: GitHub Actions
3. Guarda

### Paso 2: Configurar base URL (si es necesario)

Si vas a usar GitHub Pages, el dominio será `https://[usuario].github.io/overworkout-front/`, no la raíz.

Edita `vite.config.js`:

```javascript
export default defineConfig({
  base: '/overworkout-front/', // 👈 Añade esto
  plugins: [vue()],
  // ... resto de la config
})
```

---

## 🎯 Cuándo se ejecutan

| Acción | CI (ci.yml) | Deploy (deploy.yml) |
|--------|-------------|---------------------|
| Push a `main` | ✅ | ✅ |
| Push a `develop` | ✅ | ❌ |
| Pull Request a `main` | ✅ | ❌ |
| Manual (botón) | ❌ | ✅ |

---

## 🔍 Cómo ver los resultados

### En el repo:
1. Ve a la pestaña **Actions**
2. Verás el historial de ejecuciones
3. Clic en cualquiera para ver el log detallado

### Badges en el README:
Añade esto a tu `README.md` para mostrar el estado:

```markdown
![CI](https://github.com/[TU-USUARIO]/overworkout-front/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/[TU-USUARIO]/overworkout-front/actions/workflows/deploy.yml/badge.svg)
```

---

## 💡 Personalizaciones

### Ejecutar tests E2E en CI

Descomenta la sección `e2e` en `ci.yml`. Ten en cuenta que:
- Los tests E2E son más lentos (1-2 min extra)
- Pueden ser "flaky" (fallos intermitentes)
- Requieren más recursos

### Desactivar deploy automático

Si prefieres deploy manual:
1. En `deploy.yml`, cambia `on.push.branches` a `[]`
2. Solo se ejecutará con el botón "Run workflow"

### Añadir notificaciones

Puedes añadir notificaciones a Discord/Slack al final del deploy:

```yaml
- name: Notificar Discord
  uses: Ilshidur/action-discord@master
  with:
    args: '🚀 Deploy completado: ${{ steps.deployment.outputs.page_url }}'
  env:
    DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
```

---

## ❓ Troubleshooting

### "Process completed with exit code 1"

Mira los logs del job fallido:
- Si es en el job `quality`: Revisa ESLint o Prettier
- Si es en el job `test`: Algún test falla
- Si es en el job `build`: Error de compilación

### El deploy no aparece

1. Verifica que tienes permisos en Settings → Pages
2. Comprueba que el artifact se subió correctamente
3. Mira el log del job `deploy`

### Quiero cancelar un deploy

1. Ve a Actions → Deploy to GitHub Pages
2. Clic en los "..." del workflow en progreso
3. "Cancel workflow"

---

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
