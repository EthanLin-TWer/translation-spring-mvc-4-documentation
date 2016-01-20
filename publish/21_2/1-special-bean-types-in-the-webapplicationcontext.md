# 21.2.1 WebApplicationContext中特别的bean类型

> The Spring DispatcherServlet uses special beans to process requests and render the appropriate views. These beans are part of Spring MVC. You can choose which special beans to use by simply configuring one or more of them in the WebApplicationContext. However, you don’t need to do that initially since Spring MVC maintains a list of default beans to use if you don’t configure any. More on that in the next section. First see the table below listing the special bean types the DispatcherServlet relies on.

Spring的`DispatcherServlet`使用了特殊的bean来处理请求、渲染视图等，这些特定的bean是Spring MVC框架的一部分。如果你想指定使用哪个特定的bean，你可以在`WebApplicationContext`中简单地配置它们（没有忠于原文）。当然，这不是必须的，因为Spring MVC维护了一个默认的bean列表，如果你没有进行特别的配置，框架将会使用默认的bean。下一小节会介绍更多的细节，这里，我们将先快速地看一下，`DispatcherServlet`都依赖于哪些特殊的bean来进行它的初始化。



