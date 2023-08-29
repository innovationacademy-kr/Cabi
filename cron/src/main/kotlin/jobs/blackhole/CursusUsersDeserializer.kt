package jobs.blackhole

import com.fasterxml.jackson.databind.JsonNode
import java.time.LocalDateTime
import java.time.format.DateTimeParseException

private const val PROFILE = "user"
private const val USERNAME = "login"
private const val EMAIL = "email"
private const val BLACKHOLED_AT = "blackholed_at"

object CursusUsersDeserializer {
    fun toUsers(node: JsonNode): List<UserProfile> {
        return node.map { toUser(it) }
    }

    fun toUser(node: JsonNode): UserProfile {
        val profile = node.get(PROFILE)
        return UserProfile(
            name = profile.get(USERNAME).asText(),
            email = profile.get(EMAIL).asText(),
            blackholedAt = parseDate(profile.get(BLACKHOLED_AT).asText())
        )
    }

    private fun parseDate(date: String): LocalDateTime? =
        try {
            LocalDateTime.parse(date)
        } catch (e: DateTimeParseException) {
            null
        }
}

data class UserProfile(
    val name: String,
    val email: String,
    val blackholedAt: LocalDateTime?
)