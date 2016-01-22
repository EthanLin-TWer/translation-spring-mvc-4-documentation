# 21.3.2 使用@RequestMapping注解映射请求路径

> [Original] You use the `@RequestMapping` annotation to map URLs such as `/appointments` onto an entire class or a particular handler method. Typically the class-level annotation maps a specific request path (or path pattern) onto a form controller, with additional method-level annotations narrowing the primary mapping for a specific HTTP method request method ("GET", "POST", etc.) or an HTTP request parameter condition.

你可以使用`@RequestMapping`注解来将请求的URL（比如`/appointments`之类的）路径映射到整个类或某个特定的处理方法上去。一般来说，类级别的注解负责将一个特定的请求路径（或者一个符合某种模式的请求路径）映射到一个固定的控制器上，同时通过方法级别的注解来细化映射，即根据HTTP方法的请求方式（“GET”“POST”方法等）或者HTTP请求中携带的参数特征来将请求映射到匹配的方法上。

> [Original] The following example from the Petcare sample shows a controller in a Spring MVC application that uses this annotation:

下面这段代码示例来自Petcare，它展示了在Spring MVC的应用中如何在控制器上使用这个注解：

```
@Controller
@RequestMapping("/appointments")
public class AppointmentsController {

    private final AppointmentBook appointmentBook;

    @Autowired
    public AppointmentsController(AppointmentBook appointmentBook) {
        this.appointmentBook = appointmentBook;
    }

    @RequestMapping(method = RequestMethod.GET)
    public Map<String, Appointment> get() {
        return appointmentBook.getAppointmentsForToday();
    }

    @RequestMapping(path = "/{day}", method = RequestMethod.GET)
    public Map<String, Appointment> getForDay(@PathVariable @DateTimeFormat(iso=ISO.DATE) Date day, Model model) {
        return appointmentBook.getAppointmentsForDay(day);
    }

    @RequestMapping(path = "/new", method = RequestMethod.GET)
    public AppointmentForm getNewForm() {
        return new AppointmentForm();
    }

    @RequestMapping(method = RequestMethod.POST)
    public String add(@Valid AppointmentForm appointment, BindingResult result) {
        if (result.hasErrors()) {
            return "appointments/new";
        }
        appointmentBook.addAppointment(appointment);
        return "redirect:/appointments";
    }
}
```

> [Original] In the example, the `@RequestMapping` is used in a number of places. The first usage is on the type (class) level, which indicates that all handling methods on this controller are relative to the `/appointments` path. The `get()` method has a further `@RequestMapping` refinement: it only accepts GET requests, meaning that an HTTP GET for `/appointments` invokes this method. The `add()` has a similar refinement, and the `getNewForm()` combines the definition of HTTP method and path into one, so that GET requests for `appointments/new` are handled by that method.

在上面的示例中有许多地方都使用到了`@RequestMapping`注解。第一次出现是作用于类型（类）级别的，指示了该控制器下的所有处理方法都将以`/appointments`开头。`get()`方法上的`@RequestMapping`注解将其接受的请求进行了进一步的细化：它只接收GET方法。这样，一个请求路径为`/appointments`的HTTP GET请求将会最终调用到这个方法。`add()`方法也做了类似的细化，而`getNewForm()`方法则同时注解了能够接受的请求的HTTP方法和路径。在这种情况下，一个路径为`appointments/new`的GET请求将会被这个方法所处理。

> [Original] The `getForDay()` method shows another usage of `@RequestMapping`: URI templates. [(See the next section)](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping-uri-templates).

`getForDay()`方法则展示了`@RequestMapping`注解的另一个作用：URI模板。（这个内容请[见下节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping-uri-templates)）

> [Original] 


> [Original] 


> [Original] 


> [Original] 


> [Original] 


> [Original] 


> [Original] 


> [Original] 


> [Original] 


> [Original] 


> [Original] 


> [Original] 


> [Original] 

