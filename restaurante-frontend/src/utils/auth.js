// Manejo del token en LocalStorage
export const saveToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

// Obtener el rol del usuario decodificando el token JWT
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el JWT
    return payload.role;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

// Función de logout para cerrar sesión
export const logout = () => {
  removeToken(); // Elimina el token del almacenamiento
  window.location.href = '/'; // Redirige al login
};
