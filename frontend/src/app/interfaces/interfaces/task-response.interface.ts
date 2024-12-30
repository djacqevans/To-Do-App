export type RawTask = [number, string, number, string, string]; // Array con posizioni specifiche

export interface TaskResponse {
      done_tasks: RawTask[];    // Un array di "Task" completati
      undone_tasks: RawTask[];  // Un array di "Task" non completati
    }
    
export interface Task {
      id: number;            // ID della task
      task_title: string;    // Titolo della task
      is_completed: boolean; // Stato completamento (true/false)
      created_at: Date;    // Data di creazione (in formato ISO string)
      updated_at: Date;    // Data di aggiornamento (in formato ISO string)
      is_temporary?: boolean;
    }
    