import images
from hooks import compile_sass


hooks = {
    'page.template.pre': [images.inject_chapter_images],
    'site.output.post': [compile_sass],
}
