export function createSlug(text: string): string {
  return text
    .toLowerCase() // Converte para minúsculas
    .normalize('NFD') // Normaliza para decompor os caracteres
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim() // Remove espaços extras no início e fim
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens consecutivos
}
