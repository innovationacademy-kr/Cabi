package org.ftclub.cabinet.presentation.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ThumbnailStorageService {

	private final AmazonS3 s3Client;
	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	/**
	 * 썸네일을 S3에 업로드하고 URL을 반환한다.
	 * TODO: 실제 S3 업로드 로직으로 대체 및 s3 path 설정
	 *
	 * @param imageFile
	 * @return
	 */
	public String uploadImage(MultipartFile imageFile) throws IOException {
		if (imageFile == null || imageFile.isEmpty()) {
			return "";
		}
		log.info("Uploading content Type S3: {}", imageFile.getContentType());
		MultipartFile image = imageFile;
		String originalFilename = image.getOriginalFilename();
		String extension = originalFilename.contains(".") ? originalFilename.substring(
				originalFilename.lastIndexOf(".")) : "";
		verifyExtensionType(extension);
		String safeFileName = originalFilename.length() > 10 ? originalFilename.substring(0, 10)
				: originalFilename;
		String s3FileName = UUID.randomUUID() + safeFileName + extension;

		ObjectMetadata objectMetadata = new ObjectMetadata();
		objectMetadata.setContentType(image.getContentType());
		objectMetadata.setContentLength(image.getSize());
		s3Client.putObject(bucket, s3FileName, image.getInputStream(), objectMetadata);

		// TODO: 실제 S3 URL 반환 로직으로 대체(IAM Role을 사용하여 S3에 접근할 수 있도록 설정 필요)
//		return s3Client.getUrl(bucket, s3FileName).toString();
		return s3FileName;
	}

	private void verifyExtensionType(String extension) {
		List<String> allowedExtensions = List.of(".jpg", ".jpeg", ".png");
		if (!allowedExtensions.contains(extension.toLowerCase())) {
			throw ExceptionStatus.INVALID_FILE_EXTENSION.asServiceException();
		}
	}
}
