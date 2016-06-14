# 21.4.1 使用HandlerInterceptor拦截请求

Spring的处理器映射机制包含了处理器拦截器。拦截器在你需要为特定类型的请求应用一些功能时可能很有用，比如，检查用户身份等。

Interceptors located in the handler mapping must implement
`HandlerInterceptor` from the `org.springframework.web.servlet` package. This
interface defines three methods: `preHandle(..)` is called _before_ the actual
handler is executed; `postHandle(..)` is called _after_ the handler is
executed; and `afterCompletion(..)` is called _after the complete request has
finished_. These three methods should provide enough flexibility to do all
kinds of preprocessing and postprocessing.

The `preHandle(..)` method returns a boolean value. You can use this method to
break or continue the processing of the execution chain. When this method
returns `true`, the handler execution chain will continue; when it returns
false, the `DispatcherServlet` assumes the interceptor itself has taken care
of requests (and, for example, rendered an appropriate view) and does not
continue executing the other interceptors and the actual handler in the
execution chain.

Interceptors can be configured using the `interceptors` property, which is
present on all `HandlerMapping` classes extending from
`AbstractHandlerMapping`. This is shown in the example below:



    <beans>
        <bean id="handlerMapping"
                class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping">
            <property name="interceptors">
                <list>
                    <ref bean="officeHoursInterceptor"/>
                </list>
            </property>
        </bean>

        <bean id="officeHoursInterceptor"
                class="samples.TimeBasedAccessInterceptor">
            <property name="openingTime" value="9"/>
            <property name="closingTime" value="18"/>
        </bean>
    <beans>


    package samples;

    public class TimeBasedAccessInterceptor extends HandlerInterceptorAdapter {

        private int openingTime;
        private int closingTime;

        public void setOpeningTime(int openingTime) {
            this.openingTime = openingTime;
        }

        public void setClosingTime(int closingTime) {
            this.closingTime = closingTime;
        }

        public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                Object handler) throws Exception {
            Calendar cal = Calendar.getInstance();
            int hour = cal.get(HOUR_OF_DAY);
            if (openingTime <= hour && hour < closingTime) {
                return true;
            }
            response.sendRedirect("http://host.com/outsideOfficeHours.html");
            return false;
        }
    }

Any request handled by this mapping is intercepted by the
`TimeBasedAccessInterceptor`. If the current time is outside office hours, the
user is redirected to a static HTML file that says, for example, you can only
access the website during office hours.

![\[Note\]](images/note.png)| Note
---|---

When using the `RequestMappingHandlerMapping` the actual handler is an
instance of `HandlerMethod` which identifies the specific controller method
that will be invoked.

As you can see, the Spring adapter class `HandlerInterceptorAdapter` makes it
easier to extend the `HandlerInterceptor` interface.

![\[Tip\]](images/tip.png)| Tip
---|---

In the example above, the configured interceptor will apply to all requests
handled with annotated controller methods. If you want to narrow down the URL
paths to which an interceptor applies, you can use the MVC namespace or the
MVC Java config, or declare bean instances of type `MappedInterceptor` to do
that. See [Section 21.16.1, "Enabling the MVC Java Config or the MVC XML
Namespace"](mvc.html#mvc-config-enable "21.16.1 Enabling the MVC Java Config
or the MVC XML Namespace" ).

Note that the `postHandle` method of `HandlerInterceptor` is not always
ideally suited for use with `@ResponseBody` and `ResponseEntity` methods. In
such cases an `HttpMessageConverter` writes to and commits the response before
`postHandle` is called which makes it impossible to change the response, for
example to add a header. Instead an application can implement
`ResponseBodyAdvice` and either declare it as an `@ControllerAdvice` bean or
configure it directly on `RequestMappingHandlerAdapter`.
