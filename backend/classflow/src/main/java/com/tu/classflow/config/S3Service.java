package com.tu.classflow.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
//import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;
import java.io.IOException;
import java.util.UUID;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;

@Service
public class S3Service {
	
	@Value("${aws.accessKey}")
	private String accessKey;

	@Value("${aws.secretKey}")
	private String secretKey;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    private S3Client getClient() {
    	/*
        return S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build();
            */
    	
    	  AwsBasicCredentials awsCreds =
    	            AwsBasicCredentials.create(
    	                    accessKey,
    	                    secretKey
    	            );

    	    return S3Client.builder()
    	            .region(Region.of(region))
    	            .credentialsProvider(
    	                    StaticCredentialsProvider.create(awsCreds)
    	            )
    	            .build();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String key = "submissions/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest request = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .contentType(file.getContentType())
            .build();

        getClient().putObject(request, RequestBody.fromBytes(file.getBytes()));

        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
    }
}