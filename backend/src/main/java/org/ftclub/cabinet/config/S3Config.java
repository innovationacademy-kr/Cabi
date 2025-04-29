package org.ftclub.cabinet.config;

import java.net.URI;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

@Slf4j
@Configuration
public class S3Config {

	// check local or prod, dev
	@Value("${cabinet.local}")
	private Boolean isLocal;

	// local values
	@Value("${cloud.aws.credentials.access-key}")
	private String accessKey;
	@Value("${cloud.aws.credentials.secret-key}")
	private String secretKey;
	@Value("${cloud.aws.s3.endpoint}")
	private String endpoint;
	@Value("${cloud.aws.s3.path-style-access-enabled}")
	private Boolean pathStyleAccessEnabled;

	// common values
	@Value("${cloud.aws.region.static}")
	private String region;

	@Bean
	public S3Client s3Client() {

		// local: access s3 through MinIO
		if (isLocal) {
			log.debug("Local S3 client accessed");

			// setting for access MinIO-server
			S3Configuration s3Configuration = S3Configuration.builder()
					.pathStyleAccessEnabled(pathStyleAccessEnabled)
					.build();

			// create S3 client by builder-pattern
			return S3Client.builder()
					.region(Region.of(region))
					.endpointOverride(URI.create(endpoint))     // set MinIO server address
					.credentialsProvider(StaticCredentialsProvider.create(
							AwsBasicCredentials.create(accessKey, secretKey)
					))
					.serviceConfiguration(s3Configuration)        // set path-style S3 configuration
					.build();
		}

		// dev & prod: access s3 through ec2 instance (OIDC + IAM role)
		return S3Client.builder()
				.region(Region.of(region))
				.build();
	}
}
