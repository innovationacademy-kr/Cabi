package jobs.blackhole

import com.fasterxml.jackson.databind.JsonNode
import mu.KotlinLogging
import java.time.LocalDateTime
import java.time.format.DateTimeParseException

private val log = KotlinLogging.logger {}

private const val PROFILE = "user"
private const val USERNAME = "login"
private const val EMAIL = "email"
private const val BLACKHOLED_AT = "blackholed_at"

object CursusUsersDeserializer {
    fun toUsers(node: List<JsonNode>): List<UserProfile> {
        log.info { "called toUsers" }
        return node.map { toUser(it) }
    }

    fun toUser(node: JsonNode): UserProfile {
        log.info { "called toUser username: ${node[PROFILE][USERNAME]}" }
        return UserProfile(
            name = node[PROFILE][USERNAME].asText(),
            email = node[PROFILE][EMAIL].asText(),
            blackholedAt = parseDate(node[BLACKHOLED_AT].asText())
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