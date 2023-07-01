package org.ftclub.cabinet.auth.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.UserRole;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class TokenProviderUnitTest {

    @InjectMocks
    TokenProvider tokenProvider;

    @Mock
    GoogleApiProperties googleApiProperties;

    @Mock
    FtApiProperties ftApiProperties;

    @Mock
    JwtProperties jwtProperties;

    ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("성공: 42 서울 유저 클레임 생성")
    void 성공_makeClaimsByProviderProfile() throws JsonProcessingException, JSONException {
        String googleEmail = "dongledongledongglee@google.com";
        String ftIntraId = "yooh";
        String ftEmail = "inshin@member.kr";
        JSONObject googleProfile = new JSONObject()
                .put("email", googleEmail);
        JSONObject ftProfile = new JSONObject()
                .put("login", ftIntraId)
                .put("cursus_users", new JSONArray(new JSONObject[]{
                        new JSONObject().put("zero_index", LocalDateTime.now()),
                        new JSONObject().put("blackholed_at", LocalDateTime.now())}))
                .put("email", ftEmail);
        given(googleApiProperties.getProviderName()).willReturn("google");
        given(ftApiProperties.getProviderName()).willReturn("ft");

        Map<String, Object> googleClaims = tokenProvider.makeClaimsByProviderProfile(
                googleApiProperties.getProviderName(),
                objectMapper.readTree(googleProfile.toString()));
        Map<String, Object> ftClaims = tokenProvider.makeClaimsByProviderProfile(
                ftApiProperties.getProviderName(),
                objectMapper.readTree(ftProfile.toString()));

        assertEquals(googleEmail, googleClaims.get("email"));
        assertEquals(ftIntraId, ftClaims.get("name"));
        assertEquals(ftEmail, ftClaims.get("email"));
        assertEquals(UserRole.USER, ftClaims.get("role"));
    }

    @Test
    @DisplayName("실패: 외국 유저 클레임 생성")
    void 실패_makeClaimsByProviderProfile() throws JSONException {
        String ftIntraId = "foreign";
        String ftEmail = "foreginer@member.fr";
        JSONObject ftProfile = new JSONObject()
                .put("login", ftIntraId)
                .put("cursus_users", new JSONArray(new JSONObject[]{
                        new JSONObject().put("zero_index", LocalDateTime.now()),
                        new JSONObject().put("blackholed_at", LocalDateTime.now())}))
                .put("email", ftEmail);
        given(googleApiProperties.getProviderName()).willReturn("google");
        given(ftApiProperties.getProviderName()).willReturn("ft");

        assertThrows(ServiceException.class, () ->
        {
            tokenProvider.makeClaimsByProviderProfile(ftApiProperties.getProviderName(),
                    objectMapper.readTree(ftProfile.toString()));
        });
    }

    @Test
    @DisplayName("생략: 토큰 생성")
    @Disabled
    void createToken() {

    }

    @Test
    @DisplayName("생략: 최고 관리자 토큰 생성")
    @Disabled
    void createMasterToken() {

    }

    @Test
    @DisplayName("성공: Provider에 맞는 TokenName 반환")
    void 성공_getTokenNameByProvider() {
        given(googleApiProperties.getProviderName()).willReturn("google");
        given(ftApiProperties.getProviderName()).willReturn("ft");
        given(jwtProperties.getAdminProviderName()).willReturn("google");
        given(jwtProperties.getMainProviderName()).willReturn("ft");

        String adminTokenName = tokenProvider.getTokenNameByProvider(googleApiProperties.getProviderName());
        String userTokenName = tokenProvider.getTokenNameByProvider(ftApiProperties.getProviderName());

        assertEquals(jwtProperties.getAdminTokenName(), adminTokenName);
        assertEquals(jwtProperties.getMainTokenName(), userTokenName);
    }

    @Test
    @DisplayName("실패: 지원하지 않는 Provider인 경우")
    void 실패_getTokenNameByProvider() {
        DomainException exception = assertThrows(DomainException.class, () -> {
            tokenProvider.getTokenNameByProvider("THIS_IS_NOT_SUPPORTED_PROVIDER");
        });
        assertEquals(ExceptionStatus.INVALID_ARGUMENT, exception.getStatus());
    }

}
