package org.sterl.jsui.api;

import java.math.BigDecimal;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.validation.ConstraintViolation;
import lombok.Data;

@Data
public class ValidationError {
    private String message;
    private String path;
    private Object invalidValue;
    private String entity;
    
    public JsonObjectBuilder toJson() {
        JsonObjectBuilder result = Json.createObjectBuilder()
                .add("message", message)
                .add("path", path)
                .add("entity", entity);
        
        if (invalidValue != null) {
            if (invalidValue instanceof Integer) result.add("invalidValue", (Integer)invalidValue);
            if (invalidValue instanceof Long) result.add("invalidValue", (Long)invalidValue);
            if (invalidValue instanceof Boolean) result.add("invalidValue", (Boolean)invalidValue);
            if (invalidValue instanceof Number) result.add("invalidValue", new BigDecimal(String.valueOf(invalidValue)));
            
            result.add("invalidValue", String.valueOf(invalidValue));
        } else {
            result.add("invalidValue", JsonValue.NULL);
        }
        
        return result;
    }
    
    /**
     * Builds a nicer path for the client to access directly the erros using a map.
     * @param path the path string from the validation error
     * @param bean the bean this property is hosted
     * @return the nicer path
     */
    public static String path(String path, Class bean) {
        String result = bean == null ? "" : bean.getSimpleName() + ".";
        
        // cut of any create.arg1. prefix
        if (path.startsWith("create.arg")) {
            result += path.substring(
                    path.indexOf('.', path.indexOf(".arg") + 4) + 1, 
                    path.length());
        } else {
            result += path;
        }
        return result;
    }

    public static ValidationError of (ConstraintViolation cv) {
        ValidationError result = new ValidationError();
        result.setMessage(cv.getMessage());
        result.setPath(path(
                String.valueOf(cv.getPropertyPath()),
                cv.getLeafBean() == null ? cv.getRootBeanClass() : cv.getLeafBean().getClass())
        );
        result.setEntity(cv.getLeafBean().getClass().getSimpleName());
        result.setInvalidValue(cv.getInvalidValue());
        return result;
    }
}
