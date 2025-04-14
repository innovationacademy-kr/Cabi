package org.ftclub.cabinet.presentation.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.user.domain.User;

@Entity
@Getter
@Table(name = "PRESENTATION")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Presentation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID", nullable = false)
	private User user;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "CATEGORY", nullable = false)
	private Category category;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "DURATION", nullable = false)
	private Duration duration;

	@Column(name = "TITLE", length = 50, nullable = false)
	private String title;

	@Column(name = "SUMMARY", length = 100, nullable = false)
	private String summary;

	// TODO: 추가된 column으로 dev to main 시, main-db의 data 넣어야 함
	@Column(name = "OUTLINE", length = 500, nullable = false)
	private String outline;

	// TODO: TEXT로 명시적 변경 필요 여부 및 fetchtype 설정이 맞는지 확인
	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "DETAIL", length = 10000, nullable = false)
	private String detail;

	@Column(name = "CANCELED", nullable = false)
	private boolean canceled = false;

	@Column(name = "THUMBNAIL_LINK", length = 2048)
	private String thumbnailLink;

	@Column(name = "VIDEO_LINK", length = 2048)
	private String videoLink;

	@Column(name = "IS_RECORDING_ALLOWED", nullable = false)
	private boolean isRecordingAllowed = false;

	@Column(name = "IS_PUBLIC_ALLOWED", nullable = false)
	private boolean isPublicAllowed = false;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PRESENTATION_SLOT_ID")
	private PresentationSlot slot;

	@Column(name = "START_TIME", nullable = false)
	private LocalDateTime startTime;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "PRESENTATION_LOCATION", nullable = false)
	private PresentationLocation presentationLocation;


	@OneToMany(mappedBy = "presentation")
	private List<PresentationComment> presentationComments = new ArrayList<>();

	@OneToMany(mappedBy = "presentation")
	private List<PresentationLike> presentationLikes = new ArrayList<>();

	public static Presentation of(User user, Category category, Duration duration,
			String title, String summary, String outline, String detail,
			String thumbnailLink, boolean isRecodingAllowed, boolean isPublicAllowed,
			PresentationSlot slot) {
		return new Presentation(user, category, duration, title, summary, outline,
				detail, thumbnailLink, null, isRecodingAllowed, isPublicAllowed,
				slot, slot.getStartTime(), slot.getPresentationLocation());
	}

	protected Presentation(User user, Category category, Duration duration,
			String title, String summary, String outline, String detail,
			String thumbnailLink, String videoLink,
			boolean isRecordingAllowed, boolean isPublicAllowed,
			PresentationSlot slot,
			LocalDateTime startTime, PresentationLocation presentationLocation) {
		this.user = user;
		this.category = category;
		this.duration = duration;
		this.title = title;
		this.summary = summary;
		this.outline = outline;
		this.detail = detail;
		this.thumbnailLink = thumbnailLink;
		this.videoLink = videoLink;
		this.isRecordingAllowed = isRecordingAllowed;
		this.isPublicAllowed = isPublicAllowed;
		this.slot = slot;
		this.startTime = startTime;
		this.presentationLocation = presentationLocation;
	}
}
