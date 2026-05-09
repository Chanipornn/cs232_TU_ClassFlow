package com.tu.classflow.config;  // ตรงกับ structure

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


// ทำให้หน้าข้อมูล Student ต่อ js ได้
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/JS/**")
                .addResourceLocations("classpath:/static/JS/");
        registry.addResourceHandler("/HTML/**")
                .addResourceLocations("classpath:/static/HTML/");
    }
}