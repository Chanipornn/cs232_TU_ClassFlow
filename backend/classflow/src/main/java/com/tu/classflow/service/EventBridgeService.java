package com.tu.classflow.service;

import org.springframework.stereotype.Service;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.eventbridge.EventBridgeClient;
import software.amazon.awssdk.services.eventbridge.model.PutEventsRequest;
import software.amazon.awssdk.services.eventbridge.model.PutEventsRequestEntry;

@Service
public class EventBridgeService {

    private final EventBridgeClient client = EventBridgeClient.builder()
            .region(Region.US_EAST_1)
            .build();

    public void sendAssignmentCreatedEvent(String title) {

        PutEventsRequestEntry entry = PutEventsRequestEntry.builder()
                .source("classflow.assignment")
                .detailType("AssignmentCreated")
                .detail("{\"title\":\"" + title + "\"}")
                .eventBusName("default")
                .build();

        PutEventsRequest request = PutEventsRequest.builder()
                .entries(entry)
                .build();

        client.putEvents(request);
    }
}