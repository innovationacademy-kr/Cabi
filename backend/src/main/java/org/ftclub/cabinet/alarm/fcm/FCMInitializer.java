package org.ftclub.cabinet.alarm.fcm;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.fcm.config.FirebaseConfig;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!test")
public class FCMInitializer {

	private final ResourceLoader resourceLoader;
	private final FirebaseConfig firebaseConfig;

	@PostConstruct
	public void initialize() throws IOException {
		Path currentPath = Paths.get("").toAbsolutePath();
		if (currentPath.endsWith("backend")) {
			currentPath = currentPath.getParent();
		}
		Resource resource = resourceLoader.getResource("file:" + currentPath + firebaseConfig.getCredentialsPath());
		try (InputStream inputStream = resource.getInputStream()) {
			FirebaseOptions options = FirebaseOptions.builder()
					.setCredentials(GoogleCredentials.fromStream(inputStream))
					.build();
			if (FirebaseApp.getApps().isEmpty()) {
				FirebaseApp.initializeApp(options);
				log.info("Firebase application has been initialized");
			}
		}
	}
}
