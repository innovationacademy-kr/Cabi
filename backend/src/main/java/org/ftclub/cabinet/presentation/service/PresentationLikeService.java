package org.ftclub.cabinet.presentation.service;

import org.ftclub.cabinet.dto.PresentationLikeDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.presentation.repository.PresentationLikeRepository;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class PresentationLikeService {

	private final PresentationLikeRepository likeRepository;

	private final UserQueryService userQueryService;

	private final PresentationQueryService presentationQueryService;

	private final PresentationLikeQueryService   presentationLikeQueryService;

	public User getUserById(Long id){
		return (userQueryService.getUser(id));
	}

	public Presentation getPresentationById(Long id){
		return (presentationQueryService.getPresentation(id));
	}

	public boolean isLikedByMe(Presentation presentation, User user) {
		return presentationLikeQueryService.isLikedByMe(presentation.getId(), user);
	}

	// 생성자에서 주입
	public PresentationLikeService(PresentationLikeRepository likeRepository, UserQueryService userQueryService, PresentationQueryService presentationQueryService, PresentationLikeQueryService presentationLikeQueryService) {
		this.likeRepository = likeRepository;
		this.userQueryService = userQueryService;
		this.presentationQueryService = presentationQueryService;
		this.presentationLikeQueryService = presentationLikeQueryService;
	}

	public Long getLikedCount(long presentationId){
		return presentationLikeQueryService.getLikedCount(presentationId);
	}

	public  void postLike(PresentationLikeDto presentationLikeDto) { // TODO 이미 post되어있는 like면 에러 반환해야해서 if else로 변경 필요
		User user = getUserById(presentationLikeDto.getUserId());
		Presentation presentation = getPresentationById(presentationLikeDto.getPresentationId());
		if (likeRepository.existsByPresentationIdAndUserId(presentationLikeDto.getPresentationId(), user.getId()))
		{
			PresentationLike presentationLike = new PresentationLike(presentation, user);
			likeRepository.save(presentationLike);
		}
		else
		{
			throw ExceptionStatus.CANNOT_CREATE_SLOT_IN_PAST.asDomainException(); // TODO likeException 만들어서 던져야함
		}

	}

	public  void deleteLike(PresentationLikeDto presentationLikeDto) { // TODO 없는 like라면 에러 반환해야해서 if else로 변경 필요
		User user = getUserById(presentationLikeDto.getUserId());
		Presentation presentation = getPresentationById(presentationLikeDto.getPresentationId());
		if (likeRepository.existsByPresentationIdAndUserId(presentationLikeDto.getPresentationId(), user.getId()))
		{
			PresentationLike presentationLike = new PresentationLike(presentation, user);
			likeRepository.deleteByPresentationIdAndUserId(presentationLikeDto.getPresentationId(), user.getId());
		}
		else
		{
			throw ExceptionStatus.CANNOT_CREATE_SLOT_IN_PAST.asDomainException(); // TODO likeException 만들어서 던져야함
		}

	}

	@Transactional(readOnly = true)
	public void getPostsLikedByUser(PresentationLikeDto presentationLikeDto){

	}

}
//파사드 패턴 도입해야함 -> 이걸 파사드 하위에 쿼리 컨트롤러와 정책 컨트롤러 두기