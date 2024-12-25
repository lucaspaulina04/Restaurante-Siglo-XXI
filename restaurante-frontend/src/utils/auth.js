
export const saveToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); 
    return payload.role;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};


export const logout = () => {
  removeToken(); 
  window.location.href = '/'; 
};
