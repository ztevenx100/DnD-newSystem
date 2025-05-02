export const getUrlCharacter = async (user: string, characterId: string): Promise<string> => {
  try {
    const response = await fetch(`/api/storage/characters/${user}/${characterId}`);
    if (!response.ok) {
      throw new Error('Error al obtener la URL del personaje');
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}; 