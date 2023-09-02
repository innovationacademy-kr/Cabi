import jobs.FtTokenFetcher
import jobs.blackhole.BlackholeUpdater
import kotlin.system.exitProcess

private val mapping = mapOf(
    "update-blackhole" to BlackholeUpdater::create,
    "get-ft-token" to FtTokenFetcher::create,
)

fun main(args: Array<String>) {
    if (args.size != 1) {
        println("실행하려는 명령어 하나를 입력하세요")
        exitProcess(1)
    }
    try {
        mapping[args[0]]?.let {
            val result = it().sprint()
            if (result !is Unit) print(result)
        }?: throw Exception("해당 명령어는 존재하지 않습니다.")
    } catch (e: Exception) {
        println(e.message)
        exitProcess(1)
    }
}