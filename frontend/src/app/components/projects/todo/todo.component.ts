import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { ComunicationsService } from '../../../services/comunications.service';
import { RawTask, Task, TaskResponse } from '../../../interfaces/interfaces/task-response.interface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  tasks: { id: number, task_title: string, is_completed: boolean, created_at: Date, updated_at: Date, is_temporary?: boolean}[] = [];
  doneTasks: { id: number, task_title: string, is_completed: boolean, created_at: Date, updated_at: Date, is_temporary?: boolean}[] = [];
  current_date = new Date();
  toastDone = [
    "Great!",
    "Good job =)",
    "Teach me to be so good plsss!!"
  ];
  toastTodo = [
    "Don't give up!",
    "Try it later :-)",
    "no worries!"
  ];
  index = 0;
  ids: number[] = []
  ids_bool: {[id: number]: boolean | undefined} = {}

  //readme section
  readme = false;
  readme_button = 'R!';
  readme_button_expanded = 'Readme!';
  isHovered: boolean = false; 

  //load data
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private comuncationService: ComunicationsService
  ) {};

  //README section functions
  readme_change(): void {
    this.readme = !this.readme
    if(this.readme) {
      console.log(this.readme);
      this.readme_button = 'P!';
      this.readme_button_expanded = 'Project!';
      console.log(this.readme_button_expanded);
      
    } else {
      console.log(this.readme);
      this.readme_button = `R!`;
      this.readme_button_expanded = 'Readme!';
    }
  }

  extend_button(): void {
    setTimeout(() => {
      this.isHovered = true;    
    }, 200);
  }

  reset_button(): void {
    setTimeout(() => {
      this.isHovered = false;    
    }, 200);
  }

  //toast welcome message and load tasks
  ngOnInit(): void {

    this.loadTasks('none');

    //welcome message toast
    setTimeout(() => {
      const toast = this.renderer.selectRootElement('#toast', true);
      if (toast) {
        this.renderer.setStyle(toast, 'backgroundColor', 'blueviolet');
        this.renderer.setStyle(toast, 'color', 'white');
        this.showToast('Welcome inside :-)', 3500);
      }
    }, 1000);
  
  }

  //load tasks
  loadTasks(action: string): void {    
    this.comuncationService.get_tasks().subscribe((response: TaskResponse) => {        
     
      let done = response.done_tasks.map((task: RawTask) => ({
        id: task[0],
        task_title: task[1],
        is_completed: task[2] === 1,
        created_at: new Date(task[3]), // Converte stringa in Date
        updated_at: new Date(task[4]) // Converte stringa in Date
      }));
    
      let tod = response.undone_tasks.map((task: RawTask) => ({
        id: task[0],
        task_title: task[1],
        is_completed: task[2] === 1,
        created_at: new Date(task[3]), // Converte stringa in Date
        updated_at: new Date(task[4]) // Converte stringa in Date
      }));

      this.tasks = [];
      this.doneTasks = [];
      this.tasks.push(...tod);
      this.doneTasks.push(...done);
    }, error => {
      console.log('error :', error);
      
    });
  }

  //create a temporary task
  createTask(): void {
    let newTask = {id: 0, task_title: '', is_completed: false, created_at: this.current_date, updated_at: this.current_date, is_temporary: true};
    this.tasks.push(newTask);
  }

  //matrix where changing or adding a task
  changeOrAdd(task: { id: number, task_title: string, is_completed: boolean, created_at: Date, updated_at: Date }): void {
    if(!task.task_title.trim()) {
      console.log('empty text task');
      return;
    }

    if(task.id === 0) {
      this.addTask(task.task_title);
    } else {
      this.comuncationService.get_one_task('one id', task.id).subscribe((response: any) => {
        let task_id = response.id;
        let task_title = response.title;
        
        if(task_title === task.task_title) {
          console.log('same name');
          return;
        } else {
          console.log('change name');
          this.changeNameTask(task_id, 'change name task', task.task_title, task.is_completed);
        }
      }, error => {
        console.log('error in taking the single id', error);
      })
    }
  }

  //save the task to the db
  addTask(task_title: string) {
    if(!task_title.trim()) {
      console.log('task not saved, no text');
      return;
    }

    this.comuncationService.store_tasks(task_title).subscribe((response: Task) => {
      console.log('Task created:', response.id);

      this.tasks = this.tasks.filter(task => !task.is_temporary)

      this.tasks.push(response);      
    }, error => {
      console.log('add task error');
    });
  }

  //change task title
  changeNameTask(task_id: number, action: string, task_title: string, is_completed: boolean): void {
    if(!task_title.trim()) {
      console.log('no text');
      return;
    }

    this.comuncationService.update_task(task_id, action, is_completed, task_title).subscribe(response => {
      console.log(response);
      this.loadTasks('none');
    }, error => {
      console.log('error in changing task name');
    })
  }

  //move completed or incompleted task
  onCheck(task: {id: number, task_title: string, is_completed: boolean, created_at: Date, updated_at: Date}) {
    console.log(task);
    
    this.comuncationService.update_task(task.id, 'move1', task.is_completed, task.task_title).subscribe(response => {
      console.log(response);
      if (task.is_completed) {
        this.loadTasks('none');     
        this.toastDoneAnimation();
      } else {
        this.loadTasks('none');
        this.toastTodoAnimation();
      }
    }, error => {
      console.log(error);
    })
  }

  //delete all done tasks
  clearDoneTasks() {
    for (let i = 0; i < this.doneTasks.length; i++) {
      this.ids.push(this.doneTasks[i].id);
    }

    this.comuncationService.delete_tasks(this.ids).subscribe(response => {
      this.loadTasks('none');
      console.log("all tasks have been deleted");
    }, error => {
      console.error('error in deleting the task', error);
    });
    this.ids = [];
  }

  //move more than 1 uncompleted task to done tasks
  moveAllToDone() {
    if (this.tasks.length > 1) {
      for(let i = 0; i < this.tasks.length; i++) {
        this.ids.push(this.tasks[i].id);
      }
      
      this.comuncationService.move_more_tasks(this.ids, true, 'move+').subscribe(response => {
        this.loadTasks('none');
      }, error => {
        console.log('error move all to done');
      });

      this.ids = [];

      setTimeout(() => {
        const toast = this.renderer.selectRootElement('#toast', true);
        this.renderer.setStyle(toast, 'backgroundColor', '#21ac82');
        this.showToast('HUUUUUUUGEEEEEE!!!', 5000);
      }, 1000);
    }
  }

  //move more than 1 completed task to undone tasks
  moveAllToTasks() {
    if (this.doneTasks.length > 1) {
      for(let i = 0; i < this.doneTasks.length; i++) {
        this.ids.push(this.doneTasks[i].id);
      }
      console.log(this.ids);
      
      this.comuncationService.move_more_tasks(this.ids, false, 'move+').subscribe(response => {
        this.loadTasks('none');
      }, error => {
        console.log('errore move all to todo');
      })

      this.ids = [];

      setTimeout(() => {
        const toast = this.renderer.selectRootElement('#toast', true);
        this.renderer.setStyle(toast, 'backgroundColor', 'rgb(210, 36, 36)');
        this.showToast('IMPROOOOVE!!!', 5000);
      }, 1000);
    }
  }

  //show toast messages
  showToast(message: string, duration: number) {

    const toast = this.renderer.selectRootElement('#toast', true);
    if (toast) {
      this.renderer.setProperty(toast, 'textContent', message);
      this.renderer.setStyle(toast, 'display', 'block');
      setTimeout(() => {
        this.renderer.setStyle(toast, 'display', 'none');
      }, duration);
      
    }
  }

  toastDoneAnimation() {
    setTimeout(() => {
      this.showToast(this.toastDone[this.index], 5000);
      const toast = this.renderer.selectRootElement('#toast', true);
      this.renderer.setStyle(toast, 'backgroundColor', '#21ac82');

      this.index++;
      if (this.index >= this.toastDone.length) {
        this.index = 0;
      }
    }, 500);
  }

  toastTodoAnimation() {
    setTimeout(() => {
      this.showToast(this.toastTodo[this.index], 5000);
      const toast = this.renderer.selectRootElement('#toast', true);
      this.renderer.setStyle(toast, 'backgroundColor', 'rgb(210, 36, 36)');

      this.index++;
      if (this.index >= this.toastTodo.length) {
        this.index = 0;
      }
    }, 500);
  }
}
