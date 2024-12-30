import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskResponse } from '../interfaces/interfaces/task-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ComunicationsService {

  //chatbot
  private api_chat = 'http://127.0.0.1:5000/api/chatbot';
  private api_teach = 'http://127.0.0.1:5000/api/teach';

  //landing page
  private api_store_customers = 'http://127.0.0.1:5000/api/landing';

  //todo app
  private api_todo = 'http://127.0.0.1:5000/api/todo';

  constructor(private http: HttpClient) { }

  //chatbot comunication functions
  sendMessage(message: string): Observable<any> {
    const body = { message };
    return this.http.post(this.api_chat, body);
  }

  teachMessage(question: string, message: string): Observable<any> {
    const body = { question, answer: message };
    return this.http.post(this.api_teach, body);
  }
  
  //landing page store customers function
  store_customers(name: string, email: string, text: string): Observable <any> {
    const body = {name, email, text};
    return this.http.post(this.api_store_customers, body);
  }

  //todo app CRUD functions
  store_tasks(task_title: string): Observable<Task> {
    const body = {task_title};
    return this.http.post<Task>(this.api_todo, body);
  }

  //get a task id and title
  get_one_task(action: string, task_id: number) {
    const body = {action:action, task_id};
    console.log(body);
    
    return this.http.post(this.api_todo, body);
  }

  //get all tasks
  get_tasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(this.api_todo);
  }

  //change a task name or move it to done or undone tasks
  update_task(id: number, action: string, is_completed?: boolean, task_title?: string) {
    const body = {id, action: action, is_completed, task_title};
    return this.http.put(this.api_todo, body);
  }

  //change more tasks from done to undone and viceversa
  move_more_tasks(ids: number[], is_completed: boolean, action: string) {
    const body = {
      ids,
      is_completed: is_completed,
      action: action
    };
    return this.http.put(this.api_todo, body);
  }

  //deleting tasks
  delete_tasks(ids: number[]) {
    const body = {ids};
    return this.http.request('DELETE', this.api_todo, {body});
  }
}
