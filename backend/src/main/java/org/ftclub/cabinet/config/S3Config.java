package org.ftclub.cabinet.config;

import java.net.URI;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Slf4j
@Configuration
public class S3Config {

	// check local or prod, dev
	@Value("${cabinet.local}")
	private Boolean isLocal;

	// local values
	@Value("${cloud.aws.credentials.access-key:#{null}}")
	private String accessKey;
	@Value("${cloud.aws.credentials.secret-key:#{null}}")
	private String secretKey;
	@Value("${cloud.aws.s3.endpoint:#{null}}")
	private String endpoint;
	@Value("${cloud.aws.s3.path-style-access-enabled:#{null}}")
	private Boolean pathStyleAccessEnabled;

	// common values
	@Value("${cloud.aws.region.static}")
	private String region;

	/**
	 * 환경(local, ec2)에 맞는 S3Client 객체를 생성합니다. 파일 업로드/삭제 등 일반적인 S3 작업을 수행하는 데 사용됩니다.
	 *
	 * @return S3Client
	 */
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

		// dev & prod: create S3 pre-signer by AWS
		return S3Client.builder()
				.region(Region.of(region))
				.credentialsProvider(DefaultCredentialsProvider.create())
				.build();
	}


	/**
	 * 환경(local, ec2)에 맞는 S3Presigner 객체를 생성합니다. Pre-signed URL 생성 전용 객체입니다.
	 *
	 * @return S3Pre-signer
	 */
	@Bean
	public S3Presigner s3Presigner() {
		if (isLocal) {
			log.debug("Local S3 presigner accessed");

			// setting for access MinIO-server
			S3Configuration s3Configuration = S3Configuration.builder()
					.pathStyleAccessEnabled(pathStyleAccessEnabled)
					.build();

			// create S3 pre-signer url MinIO-server
			return S3Presigner.builder()
					.region(Region.of(region))
					.endpointOverride(URI.create(endpoint))
					.credentialsProvider(StaticCredentialsProvider.create(
							AwsBasicCredentials.create(accessKey, secretKey)
					))
					.serviceConfiguration(s3Configuration)        // set path-style S3 configuration
					.build();
		}

		// create S3 pre-signer by AWS
		return S3Presigner.builder()
				.region(Region.of(region))
				.credentialsProvider(DefaultCredentialsProvider.create())
				.build();
	}
}
