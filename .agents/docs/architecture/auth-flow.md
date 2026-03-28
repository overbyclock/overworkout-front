# Flujo de Autenticación

## Login

```
Usuario
   │
   ▼
LoginView ──► authStore.login(credentials)
                │
                ▼
         authService.login() ──► POST /login
                │
                ▼
         Guardar en localStorage:
         • overworkout_token
         • overworkout_user
         • overworkout_expires_at
                │
                ▼
         Redirigir según rol:
         • ADMIN → /admin/dashboard
         • USER → /user/home
```

## Estado de Autenticación

```javascript
// authStore (Pinia)
{
  user: { id, email, firstName, lastName, role },
  token: 'jwt_string',
  isAuthenticated: true/false,
  isAdmin: true/false  // getter
}
```

## Route Guards

```javascript
// guards.js
requiresAuth:    // ¿Logueado? Sí → continuar, No → /login
requiresAdmin:   // ¿Admin? Sí → continuar, No → /user/home
requiresGuest:   // ¿Logueado? No → continuar, Sí → redirect según rol
```

## Axios Interceptor (Request)

```javascript
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('overworkout_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Axios Interceptor (Response - Error)

```javascript
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authService.logout()  // Limpia storage
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

## Logout

```javascript
authService.logout():
  1. localStorage.removeItem('overworkout_token')
  2. localStorage.removeItem('overworkout_user')
  3. localStorage.removeItem('overworkout_expires_at')
  4. authStore.$reset()  // Limpia estado
  5. router.push('/login')
```

## Storage Keys

| Key | Contenido |
|-----|-----------|
| `overworkout_token` | JWT string |
| `overworkout_user` | JSON string del usuario |
| `overworkout_expires_at` | Timestamp de expiración |
