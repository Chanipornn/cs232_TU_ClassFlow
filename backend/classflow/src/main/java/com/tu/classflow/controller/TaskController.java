package com.tu.classflow.controller;

import com.tu.classflow.model.Task;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {
	 private List<Task> tasks = new ArrayList<>();

	    // GET all tasks
	    @GetMapping
	    public List<Task> getTasks() {
	        return tasks;
	    }

	    // POST create task
	    @PostMapping
	    public Task createTask(@RequestBody Task task) {
	        tasks.add(task);
	        return task;
	    }

	    // PUT update task
	    @PutMapping("/{id}")
	    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
	        for (Task task : tasks) {
	            if (task.getId().equals(id)) {
	                task.setTitle(updatedTask.getTitle());
	                task.setDeadline(updatedTask.getDeadline());
	                task.setStatus(updatedTask.getStatus());
	                return task;
	            }
	        }
	        return null;
	    }

	    // DELETE task
	    @DeleteMapping("/{id}")
	    public String deleteTask(@PathVariable Long id) {
	        tasks.removeIf(task -> task.getId().equals(id));
	        return "Deleted";
	    }

}
