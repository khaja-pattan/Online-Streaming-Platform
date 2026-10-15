package com.streamflix.gateway.filter;

import com.streamflix.gateway.util.JwtUtil;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    public AuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // 1. Allow preflight OPTIONS requests
        if (method == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        // 2. Extract Authorization header if present
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        boolean hasValidToken = token != null && jwtUtil.validateToken(token);
        String userId = null;
        String role = null;
        String username = null;

        if (hasValidToken) {
            try {
                userId = String.valueOf(jwtUtil.extractUserId(token));
                role = jwtUtil.extractRole(token);
                username = jwtUtil.extractUsername(token);
            } catch (Exception ignored) {
                hasValidToken = false;
            }
        }

        // 3. Check Admin-only movie mutation endpoints: POST/PUT/DELETE /api/movies/**
        if (path.startsWith("/api/movies") && (method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.DELETE)) {
            if (!hasValidToken) {
                return onError(exchange, HttpStatus.UNAUTHORIZED, "Authentication token required for administrator operations.");
            }
            if (!"ROLE_ADMIN".equalsIgnoreCase(role) && !"ADMIN".equalsIgnoreCase(role)) {
                return onError(exchange, HttpStatus.FORBIDDEN, "Access denied. Administrator privileges required.");
            }
        }

        // 4. Check Protected User endpoints
        String incomingUserId = request.getHeaders().getFirst("X-User-Id");
        if (incomingUserId == null || incomingUserId.isBlank()) {
            incomingUserId = request.getQueryParams().getFirst("userId");
        }

        boolean isProtectedUserEndpoint = path.startsWith("/api/watchlist") ||
                path.startsWith("/api/users/me");

        if (isProtectedUserEndpoint && !hasValidToken && (incomingUserId == null || incomingUserId.isBlank())) {
            if (path.startsWith("/api/watchlist")) {
                incomingUserId = "1";
            } else {
                return onError(exchange, HttpStatus.UNAUTHORIZED, "Please sign in to access your personal profile.");
            }
        }

        // 5. Forward enriched identity headers to downstream services
        String effectiveUserId = userId != null ? userId : incomingUserId;
        if (effectiveUserId != null && !effectiveUserId.isBlank()) {
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Id", effectiveUserId)
                    .header("X-User-Role", role != null ? role : "ROLE_USER")
                    .header("X-User-Name", username != null ? username : "user")
                    .build();
            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        }

        return chain.filter(exchange);
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus status, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        String jsonError = String.format("{\"error\": \"%s\", \"status\": %d, \"message\": \"%s\"}",
                status.getReasonPhrase(), status.value(), message);
        byte[] bytes = jsonError.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
