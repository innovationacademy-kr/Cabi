package org.ftclub.cabinet.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {
	//	@Value("${cabinet.production}")
//	private Boolean isProduction;
	@Value("${cloud.aws.credentials.access-key}")
	private String accessKey;
	@Value("${cloud.aws.credentials.secret-key}")
	private String secretKey;
	@Value("${cloud.aws.region.static}")
	private String region;

	public S3Config() {
	}

	@Bean
	public AmazonS3 s3Client() {
		AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
		return (AmazonS3) ((AmazonS3ClientBuilder) ((AmazonS3ClientBuilder) AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials))).withRegion(this.region)).build();
	}
}
