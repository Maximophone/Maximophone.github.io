from distutils.core import setup, Extension
from Cython.Build import cythonize

setup(
    ext_modules=cythonize(
         Extension(
             "collisions",
             sources=["server/cutils/collisions.pyx"],
             language="c++",
             # extra_compile_args=['-stdlib=libc++'],
             # extra_link_args=['-stdlib=libc++']
         )
    )
)
