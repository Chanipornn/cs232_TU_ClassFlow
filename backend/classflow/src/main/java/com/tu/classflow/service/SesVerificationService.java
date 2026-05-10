package com.tu.classflow.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.VerifyEmailIdentityRequest;

@Service
public class SesVerificationService {

    private final SesClient sesClient = SesClient.builder()
        .region(Region.US_EAST_1)
        .credentialsProvider(DefaultCredentialsProvider.create())
        .build();

    public void sendVerificationEmail(String email) {
        try {
            VerifyEmailIdentityRequest request = VerifyEmailIdentityRequest.builder()
                .emailAddress(email)
                .build();

            sesClient.verifyEmailIdentity(request);
            System.out.println("=== SES Verification sent to: " + email);

        } catch (Exception e) {
            System.err.println("=== SES Verification ERROR: " + e.getMessage());
        }
    }
}