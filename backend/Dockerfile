FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build inside container (or copy prebuilt jar)
COPY target/*.jar app.jar

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/app.jar ems-backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "ems-backend.jar"]
