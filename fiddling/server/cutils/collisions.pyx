# distutils: language = c++

from libcpp.vector cimport vector
from libc.math cimport sqrt

cdef struct s_collider:
    char* typ
    float x
    float y
    float size_x
    float size_y
    float r
    float l

ctypedef s_collider collider

cdef struct s_col_response:
    int is_colliding
    vector[int] colliding_with

ctypedef s_col_response col_response

def distance(float xa, float ya, float xb, float yb):
    return sqrt((xa-xb)*(xa-xb) + (ya-yb)*(ya-yb))

def circle_line_col(col_circle, col_line):
    pass

def solve(p_colliders):
    cdef collider cols[1000]
    cdef col_response col_resps[1000]
    cdef int l = len(p_colliders)
    cdef float d
    
    for i, p_collider in enumerate(p_colliders):
        cols[i].typ = p_collider.typ
        cols[i].x = p_collider.x
        cols[i].y = p_collider.y
        cols[i].size_x = p_collider.size_x
        cols[i].size_y = p_collider.size_y
        cols[i].r = p_collider.r
        cols[i].l = p_collider.l
        col_resps[i].is_colliding = 0
        
    for i in range(l):
        for j in range(i+1, l):
            if cols[i].typ == b"circle" and cols[j].typ == b"circle":
                d = distance(cols[i].x, cols[i].y, cols[j].x, cols[j].y)
                if d < cols[i].r*cols[i].size_x + cols[j].r*cols[j].size_x:
                    col_resps[i].is_colliding = 1
                    col_resps[j].is_colliding = 1
                    col_resps[i].colliding_with.push_back(j)
                    col_resps[j].colliding_with.push_back(i)
                if cols[i].typ == b"circle" and cols[j].typ == b"line":
                    circle_line_col(cols[i], cols[j])
                if cols[j].typ == b"line" and cols[i].typ == b"circle":
                    circle_line_col(cols[j], cols[i])
                
    return [(cr.is_colliding, [v for v in cr.colliding_with]) for cr in col_resps[:l]]
                    
