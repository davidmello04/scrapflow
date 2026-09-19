const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

if (!apiUrl) {
  throw new Error('Configure EXPO_PUBLIC_API_URL no arquivo .env do aplicativo.');
}

type ApiErrorBody = { message?: string };

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new Error(body.message ?? 'Não foi possível concluir a operação.');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
