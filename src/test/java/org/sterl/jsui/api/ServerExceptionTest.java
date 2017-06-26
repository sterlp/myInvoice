/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.sterl.jsui.api;

import java.util.Arrays;
import java.util.Set;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.ValidatorFactory;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.glassfish.jersey.server.validation.ValidationConfig;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author sterlp
 */
public class ServerExceptionTest {

    @Data @NoArgsConstructor @AllArgsConstructor
    static class Foo {
        @NotNull
        private String notNull1;
        @NotNull
        private String notNull2;
    }
    
    @Test
    public void testPath() {
        assertEquals("Foo.name", ValidationError.path("create.arg1.name", Foo.class));
        assertEquals("Foo.name", ValidationError.path("create.arg155.name", Foo.class));
        assertEquals("Foo.name", ValidationError.path("name", Foo.class));
    }
    @Test
    public void testAddValidationErrors() {
        ValidatorFactory vf = Validation.buildDefaultValidatorFactory();
        
        Set<ConstraintViolation<?>> validate = (Set)vf.getValidator().validate(new Foo("1", null));
        assertTrue(validate.size() > 0);
        
        ServerException exception = new ServerException();
        exception.addValidationErrors(validate);
        assertEquals(exception.getValidationErrors().size(), validate.size());
        
        assertNotNull(exception.getValidationErrors().get(0).getPath());
    }
}
