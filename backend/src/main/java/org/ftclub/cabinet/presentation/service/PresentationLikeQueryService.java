package org.ftclub.cabinet.presentation.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.presentation.repository.PresentationLikeRepository;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationLikeQueryService {
	private final PresentationLikeRepository presentationLikeRepository;

	public PresentationLike getPresentation(Long id){
		return presentationLikeRepository.findById(id) //optional은 객체가 있거나 널이거나
				.orElseThrow(ExceptionStatus.NOT_FOUND_USER::asServiceException);
	}

	public Long getLikedCount(Long presentationId){
		return presentationLikeRepository.countByPresentationId(presentationId); //.orElseThrow(ExceptionStatus.SLOT_NOT_FOUND::asServiceException);
	}

	public boolean isLikedByMe(Long presentationId, User user){
		return presentationLikeRepository.existsByPresentationIdAndUserId(presentationId, user.getId());
	}


}
