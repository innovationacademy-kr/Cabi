package org.ftclub.cabinet.user.service;

import java.util.Date;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

	public void banUser(Long userId, Date startAt, Date endedAt) {
		// TODO Auto-generated method stub

	}
}
