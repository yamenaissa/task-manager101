import { Component, OnInit } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-task-list',
  imports:[NgFor,RouterLink],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      tasks => this.tasks = tasks
    );
  }

  deleteTask(id: number | undefined): void {
    if (id) {
      this.taskService.deleteTask(id).subscribe(
        () => this.loadTasks()
      );
    }
  }
}