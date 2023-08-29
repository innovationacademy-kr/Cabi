package jobs.blackhole

import com.fasterxml.jackson.annotation.JsonSetter
import com.fasterxml.jackson.databind.JsonNode
import jobs.Configuration
import jobs.Sprinter
import jobs.blackhole.CursusUsersDeserializer.toUsers
import utils.ConfigLoader

interface BlackholeUpdater: Sprinter<Unit> {
companion object {
        @JvmStatic fun create(): BlackholeUpdater {
            val config = ConfigLoader.create(BlackholeUpdaterConfig::class)
            return BlackholeUpdaterImpl(config)
        }
    }
}

class BlackholeUpdaterImpl(val config: BlackholeUpdaterConfig): BlackholeUpdater {
    override fun sprint() = requestUsers()
            .map (CursusUsersDeserializer::toUser)
            .filter (::isUpdated)
            .forEach(::updateUser)

    private fun requestUsers(): JsonNode {
        TODO("요청")
    }

    private fun isUpdated(userProfile: UserProfile): Boolean {
        TODO("db와 현재 값을 통해 업데이트가 필요한 지 확인 (필요하다면 다른 클래스를 사용하여 cache도 가능")
    }

    private fun updateUser(users: UserProfile) {
        TODO("Not yet implemented")
    }
}

data class BlackholeUpdaterConfig(
    @JsonSetter("formatUrl")
    val formatUrl: String,
): Configuration