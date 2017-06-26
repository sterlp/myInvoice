package org.sterl.jsui.exceptionmapper;

import java.util.logging.Logger;
import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import org.sterl.jsui.api.ServerException;

@Provider
public class FallbackExceptionMapper implements
		      ExceptionMapper<Exception> {
    final static Logger LOG = Logger.getLogger(ValidationExceptionMapper.class.getName());

    @Inject ValidationExceptionMapper validationExceptionMapper;
    
    @Override
    public Response toResponse(Exception exception) {
        Throwable root = rootCause(exception);
        Response result;
        if (root instanceof ConstraintViolationException) {
            result = validationExceptionMapper.toResponse((ConstraintViolationException)root);
        } else {
            ServerException se = new ServerException();
            se.setCode(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
            se.setMessage(exception.getMessage());
            result = Response.serverError()
                        .entity(se.toJson().build())
                        .build();
        }
        return result;
    }
    
    private Throwable rootCause(Throwable cause) {
        if (cause.getCause() == null) return cause;
        else return rootCause(cause.getCause());
    }
    
}
