package com.tu.classflow.service;

import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.eventbridge.EventBridgeClient;
import software.amazon.awssdk.services.eventbridge.model.PutEventsRequest;
import software.amazon.awssdk.services.eventbridge.model.PutEventsRequestEntry;
import software.amazon.awssdk.services.eventbridge.model.PutEventsResponse;


@Service
public class EventBridgeService {

    private final EventBridgeClient client = EventBridgeClient.builder()
        .region(Region.US_EAST_1)
        .credentialsProvider(DefaultCredentialsProvider.create())
        .build();

    // ✅ method สำหรับ Assignment
    public void sendAssignmentCreatedEvent(String title, String courseCode, String instructorEmail) {
        try {
            System.out.println("=== EventBridge sending assignment: " + title + " / " + courseCode);

            String detail = String.format(
                "{\"title\":\"%s\",\"courseCode\":\"%s\",\"instructorEmail\":\"%s\"}",
                title, courseCode, instructorEmail
            );

            PutEventsRequestEntry entry = PutEventsRequestEntry.builder()
                    .source("classflow.assignment")
                    .detailType("AssignmentCreated")
                    .detail(detail)
                    .eventBusName("default")
                    .build();

            PutEventsResponse response = client.putEvents(
                PutEventsRequest.builder().entries(entry).build()
            );

            System.out.println("=== EventBridge result: failedCount=" + response.failedEntryCount());

        } catch (Exception e) {
            System.err.println("=== EventBridge ERROR: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ✅ method สำหรับ Announcement (เดิม ห้ามลบ)
    public void sendAnnouncementCreatedEvent(String title, String courseCode, String instructorEmail) {
        try {
            System.out.println("=== EventBridge sending: " + title + " / " + courseCode);

            String detail = String.format(
                "{\"title\":\"%s\",\"courseCode\":\"%s\",\"instructorEmail\":\"%s\"}",
                title, courseCode, instructorEmail
            );

            PutEventsRequestEntry entry = PutEventsRequestEntry.builder()
                    .source("classflow.announcement")
                    .detailType("AnnouncementCreated")
                    .detail(detail)
                    .eventBusName("default")
                    .build();

            PutEventsResponse response = client.putEvents(
                PutEventsRequest.builder().entries(entry).build()
            );

            System.out.println("=== EventBridge result: failedCount=" + response.failedEntryCount());

        } catch (Exception e) {
            System.err.println("=== EventBridge ERROR: " + e.getMessage());
            e.printStackTrace();
        }
    }
}