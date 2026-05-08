/*
package com.tu.classflow.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ปิด csrf ก่อนตอนเทส
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // อนุญาตทุก request
            );

        return http.build();
    }
}
*/

package com.tu.classflow.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ปิด csrf ก่อนตอนเทส

            .authorizeHttpRequests(auth -> auth
                // เปิด static file
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/HTML/**",
                    "/CSS/**",
                    "/JS/**",
                    "/src/**"
                ).permitAll()

                
                //.requestMatchers("/courses/**", "/assignments/**").authenticated()
                .requestMatchers("/assignments/**").permitAll()
                .requestMatchers("/submissions/**").permitAll()
                .requestMatchers("/api/notifications/**").permitAll()
                .requestMatchers("/courses/**").permitAll()

                .anyRequest().permitAll() // อนุญาตทุก request
            )

            .oauth2ResourceServer(oauth -> oauth
    .jwt(Customizer.withDefaults())
    .bearerTokenResolver(request -> {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    })
);

        return http.build();
    }
}