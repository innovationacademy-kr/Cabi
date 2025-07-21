package org.ftclub.cabinet.presentation.controller;


import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.presentation.service.ThumbnailStorageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@Slf4j
@RestController
@RequestMapping("/v6/presentations/test-s3-probe")
@RequiredArgsConstructor
public class S3ProbeTestController {

	private final ThumbnailStorageService thumbnailStorageService;

	/**
	 * 썸네일 이미지를 S3에 업로드하고, presigned URL을 생성합니다.
	 *
	 * @param thumbnail
	 * @return Map<String, String> key, getUrl
	 * @throws IOException
	 */
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Map<String, String> registerPresentation(
			@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail
	) throws IOException {

		String key = thumbnailStorageService.uploadImage(thumbnail);
		log.info("registerPresentation image key: {}", key);
		String url = thumbnailStorageService.generatePresignedUrl(key);
		log.info("registerPresentation image presigned url: {}", url);

		return Map.of(
				"key", key,
				"getUrl", url
		);
	}


	/**
	 * 해당 썸네일 이미지를 S3에서 삭제합니다.
	 *
	 * @param imageUrl
	 * @return
	 */
	@DeleteMapping
	public void deletePresentationImage(@RequestParam String imageUrl) {
		thumbnailStorageService.deleteImage(imageUrl);
	}
}
