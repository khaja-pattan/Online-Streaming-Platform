FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml ./
COPY eureka-server/pom.xml ./eureka-server/
RUN mvn -f eureka-server/pom.xml dependency:go-offline || true
COPY eureka-server/src ./eureka-server/src
RUN mvn -f eureka-server/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/eureka-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
