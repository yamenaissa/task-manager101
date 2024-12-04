import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-task-form',
  imports:[RouterLink, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['To Do', Validators.required],
      priority: ['Medium', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.taskId = +id;
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe(
      task => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority
        });
      }
    );
  }

  onSubmit() {
    const task: Task = this.taskForm.value;
  
    if (this.isEditMode) {
      this.taskService.updateTask(task).subscribe({
        next: (updatedTask) => {
          console.log('Task updated:', updatedTask);
          this.router.navigate(['/tasks']); // Redirect to the task list
        },
        error: (err) => {
          console.error('Error updating task:', err);
        },
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: (newTask) => {
          console.log('Task created:', newTask);
          this.router.navigate(['/tasks']); // Redirect to the task list
        },
        error: (err) => {
          console.error('Error creating task:', err);
        },
      });
    }
  }
  
}