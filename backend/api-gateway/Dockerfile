FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml ./
COPY api-gateway/pom.xml ./api-gateway/
RUN mvn -f api-gateway/pom.xml dependency:go-offline || true
COPY api-gateway/src ./api-gateway/src
RUN mvn -f api-gateway/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
