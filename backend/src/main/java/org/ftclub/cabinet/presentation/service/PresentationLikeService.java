package org.ftclub.cabinet.presentation.service;

import org.ftclub.cabinet.dto.PresentationLikeDto;
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

	public  void postLike(PresentationLikeDto presentationLikeDto) {
		User user = getUserById(presentationLikeDto.getUserId());
		Presentation presentation = getPresentationById(presentationLikeDto.getPresentationId());
		PresentationLike presentationLike = new PresentationLike(presentation, user);
		likeRepository.save(presentationLike);
	}

	public  void deleteLike(PresentationLikeDto presentationLikeDto) {
		User user = getUserById(presentationLikeDto.getUserId());
		Presentation presentation = getPresentationById(presentationLikeDto.getPresentationId());
		PresentationLike presentationLike = new PresentationLike(presentation, user);
		likeRepository.deleteByPresentationIdAndUserId(presentationLikeDto.getPresentationId(), user.getId());
	}

	@Transactional(readOnly = true)
	public void getPostsLikedByUser(PresentationLikeDto presentationLikeDto){

	}

}
//파사드 패턴 도입해야함 -> 이걸 파사드 하위에 쿼리 컨트롤러와 정책 컨트롤러 두기