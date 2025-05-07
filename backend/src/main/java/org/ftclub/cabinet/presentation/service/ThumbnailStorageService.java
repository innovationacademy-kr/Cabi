package org.ftclub.cabinet.presentation.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Slf4j
@Service
@RequiredArgsConstructor
public class ThumbnailStorageService {

	private static final List<String> ALLOWED_EXTENSIONS = List.of(".jpg", ".jpeg", ".png");
	private static final Duration DEFAULT_EXPIRATION = Duration.ofMinutes(5);
	private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

	private final S3Client s3Client;
	private final S3Presigner s3Presigner;
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

		// 2. Check file size
		checkFileSize(imageFile);

		// 3. Check extension type
		String originalFilename = imageFile.getOriginalFilename();
		String extension = originalFilename.contains(".") ? originalFilename.substring(
				originalFilename.lastIndexOf(".")) : "";
		verifyExtensionType(extension);

		// 4. Create unique file name and s3 key
		String safeFileNameBase = (originalFilename.length() > 10
				? originalFilename.substring(0, 10) : originalFilename)
				.replaceAll("[^a-zA-Z0-9.-]", "_");
		String uniqueFileName = UUID.randomUUID() + "_" + safeFileNameBase + extension;

		// 5. Create s3 key = {folder}/{uniqueFileName}
		String s3Key = thumbnailFolder + "/" + uniqueFileName;

		// 6. Upload file to S3 (sdk v2)
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

	private void checkFileSize(MultipartFile imageFile) {
		if (imageFile.getSize() > MAX_FILE_SIZE_BYTES) {
			log.error("Uploaded file size ({}) exceeds the limit of {} bytes.",
					imageFile.getSize(), MAX_FILE_SIZE_BYTES);
			throw new ServiceException(ExceptionStatus.FILE_SIZE_EXCEEDED);
		}
	}

	private void verifyExtensionType(String extension) {
		if (extension == null || extension.isEmpty()) {
			throw ExceptionStatus.INVALID_FILE_EXTENSION.asServiceException();
		}
		if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
			throw ExceptionStatus.INVALID_FILE_EXTENSION.asServiceException();
		}
	}


	/**
	 * S3에 저장된 이미지의 Pre-signed URL을 생성합니다. (제한시간: DEFAULT_EXPIRATION)
	 *
	 * @param s3Key
	 * @return Pre-signed URL
	 */
	public String generatePresignedUrl(String s3Key) {
		// 1. Check if the key is null or empty -> static images will be rendered
		if (!StringUtils.hasText(s3Key)) {
			log.debug("s3Key is null or empty. Returning empty string.");
			return "";
		}

		try {
			// 2. Create object of request (sdk v2)
			GetObjectRequest getObjectRequest = GetObjectRequest.builder()
					.bucket(bucket)
					.key(s3Key)
					.build();

			// 3. Create object of presigned-request with DEFAULT_EXPIRATION
			GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
					.signatureDuration(DEFAULT_EXPIRATION)
					.getObjectRequest(getObjectRequest)
					.build();
			PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(
					getObjectPresignRequest);

			URL url = presignedRequest.url();
			log.debug("Generated presigned URL for key '{}', valid for {}: {}", s3Key,
					DEFAULT_EXPIRATION, url);
			return url.toString();
		} catch (SdkException e) {
			log.error("Could not generate presigned URL for Bucket: {}, Key: {}. Error: {}",
					bucket, s3Key, e.getMessage());
			throw new ServiceException(ExceptionStatus.S3_GET_URL_FAILED);
		}
	}


	/**
	 * S3에서 이미지를 삭제합니다.
	 *
	 * @param s3Key 삭제할 이미지의 S3 key
	 */
	public void deleteImage(String s3Key) {
		try {
			// 1. Create DeleteObjectRequest (sdk v2)
			DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
					.bucket(bucket)
					.key(s3Key)
					.build();

			// 2. Delete the object
			s3Client.deleteObject(deleteObjectRequest);
			log.debug("Successfully deleted file from S3. Bucket: {}, Key: {}", bucket, s3Key);
		} catch (S3Exception e) {
			log.error("Error deleting file from S3: Bucket={}, Key={}", bucket, s3Key, e);
			throw new ServiceException(ExceptionStatus.S3_DELETE_FAILED);
		}
	}
}