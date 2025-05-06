package org.ftclub.cabinet.presentation.service;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Slf4j
@Service
@RequiredArgsConstructor
public class ThumbnailStorageService {

	private static final List<String> ALLOWED_EXTENSIONS = List.of(".jpg", ".jpeg", ".png");
	private static final Duration DEFAULT_EXPIRATION = Duration.ofMinutes(5);

	private final S3Client s3Client;
	//	private final S3Presigner s3Presigner;
	@Value("${cloud.aws.s3.bucket}")
	private String bucket;
	@Value("${cloud.aws.s3.image-folder}")
	private String thumbnailFolder;

	/**
	 * 썸네일을 S3(또는 MinIO)에 업로드하고 저장된 객체의 S3 key를 반환합니다.
	 *
	 * @param imageFile 업로드할 이미지 파일
	 * @return 저장된 객체의 S3 key
	 */
	public String uploadImage(MultipartFile imageFile) throws IOException {
		// 1. Check if the file is empty -> static images will be rendered
		if (imageFile == null || imageFile.isEmpty()) {
			return "";
		}

		// 2. Check extension type
		String originalFilename = imageFile.getOriginalFilename();
		String extension = originalFilename.contains(".") ? originalFilename.substring(
				originalFilename.lastIndexOf(".")) : "";
		verifyExtensionType(extension);

		// 3. create unique file name
		String safeFileNameBase = (originalFilename.length() > 10
				? originalFilename.substring(0, 10) : originalFilename)
				.replaceAll("[^a-zA-Z0-9.-]", "_");
		String uniqueFileName = UUID.randomUUID() + "_" + safeFileNameBase + extension;

		// 4. create s3 key = {folder}/{uniqueFileName}
		String s3Key = thumbnailFolder + "/" + uniqueFileName;

		// 5. upload file to S3
		try (InputStream inputStream = imageFile.getInputStream()) {
			PutObjectRequest putObjectRequest = PutObjectRequest.builder()
					.bucket(bucket)
					.key(s3Key)
					.contentType(imageFile.getContentType())
					.contentLength(imageFile.getSize())
					.build();

			s3Client.putObject(putObjectRequest,
					RequestBody.fromInputStream(inputStream, imageFile.getSize()));
		} catch (S3Exception e) {
			log.error("AWS S3 Error Details: {}, Key={}", e.awsErrorDetails().errorMessage(),
					s3Key);
			throw new ServiceException(ExceptionStatus.S3_UPLOAD_FAILED);

		} catch (SdkException e) {
			log.error("SDK Error during upload (non-S3): Bucket={}, Key={}, Error={}", bucket,
					s3Key, e.getMessage());
			throw new ServiceException(ExceptionStatus.S3_UPLOAD_FAILED);

		}

		log.debug("Successfully uploaded file. Bucket: {}, Key: {}", bucket, s3Key);
		return s3Key;
	}

	private void verifyExtensionType(String extension) {
		if (extension == null || extension.isEmpty()) {
			throw ExceptionStatus.INVALID_FILE_EXTENSION.asServiceException();
		}
		if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
			throw ExceptionStatus.INVALID_FILE_EXTENSION.asServiceException();
		}
	}

}