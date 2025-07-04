package org.ftclub.cabinet.presentation.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.presentation.dto.PresentationLikeDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.presentation.repository.PresentationLikeRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class PresentationLikeService {

	private final PresentationLikeRepository likeRepository;

	private final UserQueryService userQueryService;

	private final PresentationQueryService presentationQueryService;

	private final PresentationLikeQueryService presentationLikeQueryService;

	public User getUserById(Long id){
		return (userQueryService.getUser(id));
	}

//	public Presentation getPresentationById(Long id){
//		return (presentationQueryService.findPresentationById(id));
//	}
//
//	public boolean isLikedByMe(Presentation presentation, User user) {
//		return presentationLikeQueryService.isLikedByMe(presentation.getId(), user);
//	}
//
//	public Long getLikedCount(long presentationId){
//		return presentationLikeQueryService.getLikedCount(presentationId);
//	}

	public  void postLike(PresentationLikeDto presentationLikeDto) {
		User user = getUserById(presentationLikeDto.getUserId());
		Presentation presentation = presentationQueryService.findPresentationById(presentationLikeDto.getPresentationId());
		if (likeRepository.existsByPresentationIdAndUserId(presentationLikeDto.getPresentationId(), user.getId()))
		{
			throw ExceptionStatus.LIKE_ALREADY_EXISTS.asDomainException();
		}
		else
		{
			PresentationLike presentationLike = new PresentationLike(presentation, user);
			likeRepository.save(presentationLike);
		}

	}

	public  void deleteLike(PresentationLikeDto presentationLikeDto) {
		User user = getUserById(presentationLikeDto.getUserId());
		Presentation presentation = presentationQueryService.findPresentationById(presentationLikeDto.getPresentationId());
		if (likeRepository.existsByPresentationIdAndUserId(presentationLikeDto.getPresentationId(), user.getId()))
		{
			PresentationLike presentationLike = new PresentationLike(presentation, user);
			likeRepository.deleteByPresentationIdAndUserId(presentationLikeDto.getPresentationId(), user.getId());
		}
		else
		{
			throw ExceptionStatus.LIKE_NOT_FOUND.asDomainException();
		}

	}

//	@Transactional(readOnly = true)
//	public void getPostsLikedByUser(PresentationLikeDto presentationLikeDto){
//
//	}

}