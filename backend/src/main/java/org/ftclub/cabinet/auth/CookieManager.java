package org.ftclub.cabinet.auth;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.DomainNameProperties;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieManager {

    private final DomainNameProperties domainNameProperties;

    public String getCookie(HttpServletRequest req, String name) {
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public void setCookie(HttpServletResponse res, String name, String value, String path,
            String serverName) {
        Cookie cookie = new Cookie(name, value);
        cookie.setMaxAge(60 * 60 * 24 * 28); // 28 days, jwt properties로 설정 가능
        cookie.setPath(path);
        if (serverName.equals(domainNameProperties.getLocal())) {
            cookie.setDomain(domainNameProperties.getLocal());
        } else {
            cookie.setDomain(domainNameProperties.getCookieDomain());
        }
        res.addCookie(cookie);
    }

    public void deleteCookie(HttpServletResponse res, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setMaxAge(0);
        res.addCookie(cookie);
    }

    public void deleteAllCookies(HttpServletRequest req, HttpServletResponse res) {
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setMaxAge(0);
                res.addCookie(cookie);
            }
        }
    }
}
