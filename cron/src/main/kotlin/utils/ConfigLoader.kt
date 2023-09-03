package utils

import com.fasterxml.jackson.databind.ObjectMapper
import kotlin.reflect.KClass

/**
 * A configuration interface.
 * ConfigLoader와 함께 사용한다.
 * - 해당 인터페이스를 구현한 클래스의 맴버변수들은 "config/className.json"에 값이 있어야한다. (className은 해당 클래스의 이름)
 * - 해당 인터페이스를 구현한 클래스는 Jacson의 ObjectMapper를 이용하여 값을 집어넣을 수 있어야한다.
 *
 * @see ConfigLoader
 */
interface Configuration

/**
 * Configuration을 생성하는 클래스.
 * create()를 통해 Configuration을 생성한다.
 *
 * @see Configuration
 */
object ConfigLoader {
    /**
     * Configuration을 생성한다.
     * - 해당 클래스의 이름으로 config/className.json 파일을 찾는다.
     *
     * @param configClass Configuration을 생성할 클래스
     * @see Configuration
     * @throws NoSuchElementException 파일이 없을 경우
     * @throws IllegalArgumentException 파일 포멧이 잘못된 경우
     */
    fun<T: Configuration> create(configClass: KClass<T>): T {
        return create(configClass, "config/${configClass.simpleName}.json")
    }

    /**
     * Configuration을 생성한다.
     *
     * @param configClass Configuration을 생성할 클래스
     * @param filePath Configuration을 생성할 파일의 경로
     * @see Configuration
     * @throws NoSuchElementException 파일이 없을 경우
     * @throws IllegalArgumentException 파일 포멧이 잘못된 경우
     */
    fun<T: Configuration> create(configClass: KClass<T>, filePath: String): T {
        val url = configClass::class.java.classLoader.getResource(filePath)
            ?: throw NoSuchElementException("No such file: $filePath")
        return ObjectMapper()
            .readerFor(configClass.java)
            .readValue(url, configClass.java)
            ?: throw IllegalArgumentException("Failed to read config file: $filePath")
    }
}