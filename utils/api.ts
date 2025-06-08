// Função para obter a URL base da API
export const getApiUrl = () => {
  // Em desenvolvimento, use localhost
  if (__DEV__) {
    return 'http://localhost:3000/api';
  }
  // Em produção, use a URL do servidor
  return 'https://seu-servidor.com/api';
}; 