from hooks import compile_sass


hooks = {
    'page.template.pre': [],
    'site.output.post': [compile_sass],
}
