package org.sterl.common.jsf;

import java.io.IOException;
import java.util.logging.Logger;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Simple filter class to access webjars as is
 * @see https://github.com/wro4j/wro4j/blob/1.8.x/wro4j-core/src/main/java/ro/isdc/wro/http/WroFilter.java
 * @author Paul Sterl
 */
public class WebjarFilter implements Filter {
    private final static Logger LOG = Logger.getLogger(WebjarFilter.class.getName());
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        final HttpServletRequest request = (HttpServletRequest) req;
        final HttpServletResponse response = (HttpServletResponse) res;
        LOG.info("getContextPath -> " + request.getContextPath());
        LOG.info("getContextPath -> " + request.getContextPath());
        LOG.info("getServletPath -> " + request.getServletPath());
        LOG.info("getRequestURL -> " + request.getRequestURL());
                
    }

    @Override
    public void destroy() {
        
    }
    
}
