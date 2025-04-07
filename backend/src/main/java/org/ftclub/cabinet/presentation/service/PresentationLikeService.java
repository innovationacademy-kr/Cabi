package org.ftclub.cabinet.presentation.service;

import org.ftclub.cabinet.dto.PresentationLikeDto;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.ftclub.cabinet.presentation.repository.PresentationLikeRepository;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PresentationLikeService {

	private final PresentationLikeRepository likeRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PresentationRepository presentationRepository;

	public User getUserById(Long id){
		return (userRepository.findById(id).orElse(null));
	}

	public Presentation getPresentationById(Long id){
		return (presentationRepository.findById(id).orElse(null));
	}

	// 생성자에서 주입
	public PresentationLikeService(PresentationLikeRepository likeRepository) {
		this.likeRepository = likeRepository;
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

	public void getPostsLikedByUser(Long userId){

	}

}
