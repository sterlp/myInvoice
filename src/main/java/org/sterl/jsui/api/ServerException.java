package org.sterl.jsui.api;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.validation.ConstraintViolation;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Simple class represents a server exception
 */
@Data @EqualsAndHashCode(of = {"code", "message"}) 
@XmlRootElement
public class ServerException {
    private int code;
    private String message;
    private List<ValidationError> validationErrors;
    
    // jersy moxy sucks for maps so we make it right here
    public JsonObjectBuilder toJson() {
        JsonObjectBuilder result = Json.createObjectBuilder();
        result.add("code", code);
        if (message != null) result.add("message", message);

        JsonObjectBuilder ves = null;
        if (this.validationErrors != null && !validationErrors.isEmpty()) {
            ves = Json.createObjectBuilder();
            for (ValidationError ve : validationErrors) {
                ves.add(ve.getPath(), ve.toJson());
            }
        }
        if (ves != null) result.add("validationErrors", ves);
        return result;
    }
    
    public void addValidationErrors(Set<ConstraintViolation<?>> constraintViolations) {
        if (constraintViolations != null && !constraintViolations.isEmpty()) {
            validationErrors = constraintViolations.stream().map(cv -> ValidationError.of(cv)).collect(Collectors.toList());
        }
    }
}
