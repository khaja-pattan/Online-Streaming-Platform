FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml ./
COPY movie-catalog-service/pom.xml ./movie-catalog-service/
RUN mvn -f movie-catalog-service/pom.xml dependency:go-offline || true
COPY movie-catalog-service/src ./movie-catalog-service/src
RUN mvn -f movie-catalog-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/movie-catalog-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
