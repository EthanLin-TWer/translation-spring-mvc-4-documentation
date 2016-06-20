# 21.10.3 Servlet 3.0下的MultipartResolver

In order to use Servlet 3.0 based multipart parsing, you need to mark the
`DispatcherServlet` with a `"multipart-config"` section in `web.xml`, or with
a `javax.servlet.MultipartConfigElement` in programmatic Servlet registration,
or in case of a custom Servlet class possibly with a
`javax.servlet.annotation.MultipartConfig` annotation on your Servlet class.
Configuration settings such as maximum sizes or storage locations need to be
applied at that Servlet registration level as Servlet 3.0 does not allow for
those settings to be done from the MultipartResolver.

Once Servlet 3.0 multipart parsing has been enabled in one of the above
mentioned ways you can add the `StandardServletMultipartResolver` to your
Spring configuration:



    <bean id="multipartResolver"
            class="org.springframework.web.multipart.support.StandardServletMultipartResolver">
    </bean>
