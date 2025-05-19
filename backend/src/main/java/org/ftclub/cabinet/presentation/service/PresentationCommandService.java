package org.ftclub.cabinet.presentation.service;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class PresentationCommandService {

	private final PresentationRepository presentationRepository;
	private final ThumbnailStorageService thumbnailStorageService;

	public Presentation createPresentation(User user,
			PresentationFormRequestDto form,
			PresentationSlot slot,
			MultipartFile thumbnail) throws IOException {

		// upload thumbnail in S3
		String thumbnailLink = thumbnailStorageService.uploadImage(thumbnail);

		// create
		Presentation newPresentation = Presentation.of(
				user,
				form.getCategory(),
				form.getDuration(),
				form.getTitle(),
				form.getSummary(),
				form.getOutline(),
				form.getDetail(),
				thumbnailLink,
				form.getIsRecordingAllowed(),
				form.getIsPublicAllowed(),
				slot
		);

		// save
		return presentationRepository.save(newPresentation);
	}
}
