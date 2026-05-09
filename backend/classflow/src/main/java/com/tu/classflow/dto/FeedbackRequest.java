package com.tu.classflow.dto;

public class FeedbackRequest {
	 private Double grade;
	    private Double maxScore;
	    private String comment;
	    private String gradedBy;

	    public Double getGrade() {
	        return grade;
	    }

	    public void setGrade(Double grade) {
	        this.grade = grade;
	    }

	    public Double getMaxScore() {
	        return maxScore;
	    }

	    public void setMaxScore(Double maxScore) {
	        this.maxScore = maxScore;
	    }

	    public String getComment() {
	        return comment;
	    }

	    public void setComment(String comment) {
	        this.comment = comment;
	    }

	    public String getGradedBy() {
	        return gradedBy;
	    }

	    public void setGradedBy(String gradedBy) {
	        this.gradedBy = gradedBy;
	    }

}
