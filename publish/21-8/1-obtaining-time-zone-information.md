# 21.8.1 获取时区信息

除了获取客户端的地区信息外，有时他们所在的时区信息也非常有用。`LocaleContextResolver`接口为`LocaleResolver`提供了拓展点，允许解析器在`LocaleContext`中提供更多的信息，这里面就可以包含时区信息。

如果用户的时区信息能被解析到，那么你总可以通过`RequestContext.getTimeZone()`方法获得。时区信息会自动被Spring`ConversionService`下注册的日期/时间转换器`Converter`及格式化对象`Formatter`所使用。
