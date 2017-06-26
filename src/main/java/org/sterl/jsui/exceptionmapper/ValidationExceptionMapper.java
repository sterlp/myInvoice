/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.sterl.jsui.exceptionmapper;

import java.util.logging.Logger;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import org.sterl.jsui.api.ServerException;

@Provider
public class ValidationExceptionMapper implements
		      ExceptionMapper<ConstraintViolationException> {
    final static Logger LOG = Logger.getLogger(ValidationExceptionMapper.class.getName());

    @Override
    @Produces(MediaType.APPLICATION_JSON)
    public Response toResponse(ConstraintViolationException exception) {
        LOG.info("ConstraintViolationException -> " 
                + exception.getMessage() 
                + " "
                + exception.getConstraintViolations());
        ServerException result = new ServerException();
        result.setCode(Response.Status.BAD_REQUEST.getStatusCode());
        result.setMessage(exception.getMessage());
        result.addValidationErrors(exception.getConstraintViolations());

        return Response.status(Response.Status.BAD_REQUEST).entity(
                result.toJson().build()).build();
    }
}
