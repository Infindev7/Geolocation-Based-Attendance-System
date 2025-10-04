package com.geofencing.attendance;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
public class GenericController {

    @GetMapping("/user")
    public String getUsers() {
        return "This is User Side";
    }

    @GetMapping("/admin")
    public String getAdmin() {
        return "This is admins Side";
    }
    
    
}
