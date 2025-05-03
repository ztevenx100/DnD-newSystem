export const getUrlStage = async (stageId: string): Promise<string> => {
  try {
    const response = await fetch(`/api/world/storage/stages/${stageId}`);
    if (!response.ok) {
      throw new Error('Error al obtener la URL del escenario');
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
};

export const getUrlSound = async (soundId: string): Promise<string> => {
  try {
    const response = await fetch(`/api/world/storage/sounds/${soundId}`);
    if (!response.ok) {
      throw new Error('Error al obtener la URL del sonido');
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}; 