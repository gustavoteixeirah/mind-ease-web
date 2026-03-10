/**
 * Tipo compartilhado entre Home e Tarefas.
 * Quem implementar a aba Tarefas pode estender ou usar este tipo.
 */
export type TaskItem = {
  id: string;
  title: string;
  done?: boolean;
  /** ID da tarefa escolhida para "Foque agora" (só uma por vez) */
  isFocus?: boolean;
  /** Data no formato YYYY-MM-DD para filtrar "Hoje" */
  date?: string;
};

export function isToday(dateStr?: string): boolean {
  if (!dateStr) return true;
  const today = new Date().toISOString().slice(0, 10);
  return dateStr === today;
}
