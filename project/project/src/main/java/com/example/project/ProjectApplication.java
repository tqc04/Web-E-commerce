package com.example.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.cache.annotation.EnableCaching; // Disabled - not used
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication(exclude = {
		org.springframework.ai.autoconfigure.vectorstore.chroma.ChromaVectorStoreAutoConfiguration.class
})
// @EnableCaching // Disabled - not used
@EnableAsync
@EnableScheduling
@EnableTransactionManagement
@EnableJpaRepositories
@EnableKafka
public class ProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}

}
