import glob
import os


FILE_TYPES = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF']
TEMPLATE_TYPE = 'anhilem'
ROOT_IMG_PATH = os.path.abspath('./media/img/chapters/')


def inject_chapter_images(page, wok):
    """
    {
        'chapter1': ['path/img1', 'path/img2'],
        'chapter2': ['path/img3', 'path/img4']
    } into anhilem template.
    """
    if (page.meta.get('type') != TEMPLATE_TYPE):
        return

    chapters = sorted(wok['site']['categories']['chapter'],
                      key=lambda chp: chp['chapter'])
    for chapter in chapters:
        slug = chapter['slug']

        # Get all files in chapter's image dir that is of
        # a whitelisted image type.
        chapter['images'] = [
            img_path for img_path in
            glob.glob('/'.join([ROOT_IMG_PATH, slug, '*']))
            if img_path.split('.')[-1] in FILE_TYPES
        ]
