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
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

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

                .anyRequest().permitAll() // อนุญาตทุก request
            )

            .oauth2ResourceServer(oauth -> oauth
            		.jwt(Customizer.withDefaults())
            		);

        return http.build();
    }
}