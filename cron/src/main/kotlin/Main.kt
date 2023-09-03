import jobs.FtTokenFetcher
import jobs.blackhole.BlackholeUpdater
import mu.KotlinLogging
import kotlin.math.log
import kotlin.system.exitProcess

/**
 * command list
 * format: command to creator function
 */
private val mapping = mapOf(
    "update-blackhole" to BlackholeUpdater::create,
    "get-ft-token" to FtTokenFetcher::create,
)

private val log = KotlinLogging.logger {}

/**
 * main function
 * @param args command list
 *
 *  인자가 하나가 아니라면 에러 메시지를 로깅하고 종료한다.
 *  잘못된 인자가 들어왔다면 에러 메시지를 로깅하고 종료한다.
 *  실행 중 에러가 발생하면 에러 메시지를 로깅하고 종료한다.
 */
fun main(args: Array<String>) {
    if (args.size != 1) {
        log.warn { "실행하려는 명령어 하나를 입력하세요" }
        exitProcess(1)
    }
    try {
        mapping[args[0]]?.let {
            val result = it().sprint()
            if (result !is Unit) print(result)
        }?: throw Exception("해당 명령어 ${args[0]}는 존재하지 않습니다.")
    } catch (e: Exception) {
        log.warn { e.message }
        exitProcess(1)
    }
}