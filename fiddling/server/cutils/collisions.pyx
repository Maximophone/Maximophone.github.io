# distutils: language = c++

from libcpp.vector cimport vector
from libc.math cimport sqrt
#from libcpp cimport bool

cdef struct s_collider:
    char* typ
    float x
    float y
    float size
    float r

ctypedef s_collider collider

cdef struct s_col_response:
    int is_colliding
    vector[int] colliding_with

ctypedef s_col_response col_response

def distance(float xa, float ya, float xb, float yb):
    return sqrt((xa-xb)*(xa-xb) + (ya-yb)*(ya-yb))

def solve(p_colliders):
    cdef collider cols[1000]
    cdef col_response col_resps[1000]
    cdef int l = len(p_colliders)
    cdef float d
    
    for i, p_collider in enumerate(p_colliders):
        cols[i].typ = p_collider.typ
        cols[i].x = p_collider.x
        cols[i].y = p_collider.y
        cols[i].size = p_collider.size
        cols[i].r = p_collider.r
        col_resps[i].is_colliding = 0
        
    for i in range(l):
        for j in range(i+1, l):
            if cols[i].typ == b"circle" and cols[j].typ == b"circle":
                d = distance(cols[i].x, cols[i].y, cols[j].x, cols[j].y)
                if d < cols[i].r*cols[i].size + cols[j].r*cols[j].size:
                    col_resps[i].is_colliding = 1
                    col_resps[j].is_colliding = 1
                    col_resps[i].colliding_with.push_back(j)
                    col_resps[j].colliding_with.push_back(i)
    return [(cr.is_colliding, [v for v in cr.colliding_with]) for cr in col_resps[:l]]
                    
