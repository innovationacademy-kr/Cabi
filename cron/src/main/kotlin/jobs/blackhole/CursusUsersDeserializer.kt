package jobs.blackhole

import com.fasterxml.jackson.databind.JsonNode
import java.time.LocalDateTime
import java.time.format.DateTimeParseException

const val PROFILE = "user"
const val USERNAME = "login"
const val EMAIL = "email"
const val BLACKHOLED_AT = "blackholed_at"

class CursusUsersDeserializer(val node: JsonNode) {
    fun toUsers(): List<UserProfile> {
        return node.map { toUserProfile(it) }
    }

    private fun toUserProfile(node: JsonNode): UserProfile {
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