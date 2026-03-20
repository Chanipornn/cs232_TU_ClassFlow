package com.tu.classflow.model;

public class Task {
	private Long id;
    private String title;
    private String deadline;
    private String status;

    public Task() {}

    public Task(Long id, String title, String deadline, String status) {
        this.id = id;
        this.title = title;
        this.deadline = deadline;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

}
