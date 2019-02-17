# distutils: language = c++

from libcpp.vector cimport vector
from libc.math cimport sqrt, cos, sin

cdef struct s_vect:
    float x
    float y

cdef struct s_collider:
    char* typ
    float x
    float y
    float rot
    float size_x
    float size_y
    float r
    float l

ctypedef s_collider collider
ctypedef s_vect vect

cdef struct s_col_response:
    int is_colliding
    vector[int] colliding_with
    vector[float] penetrations

ctypedef s_col_response col_response

def distance(float xa, float ya, float xb, float yb):
    return sqrt((xa-xb)*(xa-xb) + (ya-yb)*(ya-yb))

def v_add(vect a, vect b):
    cdef vect c
    c.x = a.x + b.x
    c.y = a.y + b.y
    return c

def v_sub(vect a, vect b):
    cdef vect c
    c.x = a.x - b.x
    c.y = a.y - b.y
    return c

def v_dot(vect a, vect b):
    return a.x*b.x + a.y*b.y

cdef float circle_line_col(collider col_circle, collider col_line):

    cdef vect E # start of line
    # col_line.x and y indicate the center of the line
    E.x = col_line.x - col_line.size_x*cos(col_line.rot)
    E.y = col_line.y - col_line.size_x*sin(col_line.rot)

    cdef vect L # end of line
    # size x is the length of the line
    L.x = E.x + 2*col_line.size_x*cos(col_line.rot)
    L.y = E.y + 2*col_line.size_x*sin(col_line.rot)

    cdef vect C # center of sphere
    C.x = col_circle.x
    C.y = col_circle.y

    cdef float r = col_circle.r*col_circle.size_x # radius of sphere
    
    # d is direction vector of line from start to end
    cdef vect d = v_sub(L, E)
    
    # f is vector from center of sphere to start of line
    cdef vect f = v_sub(E, C)
    
    cdef float a = v_dot(d, d)
    cdef float b = 2*v_dot(f, d)
    cdef float c = v_dot(f, f) - r*r

    cdef float discriminant = b*b-4*a*c

    cdef float t1
    cdef float t2
    
    if discriminant < 0:
        # no intersection
        return -1.0
    else:
        # ray didn't totally miss sphere,
        # so there is a solution to
        # the equation.

        discriminant = sqrt( discriminant )

        # either solution may be on or off the ray so need to test both
        # t1 is always the smaller value, because BOTH discriminant and
        # a are nonnegative.
        t1 = (-b - discriminant)/(2*a)
        t2 = (-b + discriminant)/(2*a)

        # 3x HIT cases:
        #          -o->             --|-->  |            |  --|->
        # Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit), 

        # 3x MISS cases:
        #       ->  o                     o ->              | -> |
        # FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)

        if t1 >= 0 and t1 <= 1:
            # t1 is the intersection, and it's closer than t2
            # (since t1 uses -b - discriminant)
            # Impale, Poke
            return 1.0

        # here t1 didn't intersect so we are either started
        # inside the sphere or completely past it
        if t2 >= 0 and t2 <= 1:
            # ExitWound
            return 1.0

        # no intn: FallShort, Past, CompletelyInside
        return -1.0

cdef void handle_collision(col_response* col_resps, int i, int j, float penetration):
    col_resps[i].is_colliding = 1
    col_resps[j].is_colliding = 1
    col_resps[i].colliding_with.push_back(j)
    col_resps[j].colliding_with.push_back(i)
    col_resps[i].penetrations.push_back(penetration)
    col_resps[j].penetrations.push_back(penetration)
    
def solve(p_colliders):
    cdef collider cols[1000]
    cdef col_response col_resps[1000]
    cdef int l = len(p_colliders)
    cdef float d
    cdef float penetration
    
    for i, p_collider in enumerate(p_colliders):
        cols[i].typ = p_collider.typ
        cols[i].x = p_collider.x
        cols[i].y = p_collider.y
        cols[i].rot = p_collider.rot
        cols[i].size_x = p_collider.size_x
        cols[i].size_y = p_collider.size_y
        cols[i].r = p_collider.r
        cols[i].l = p_collider.l
        col_resps[i].is_colliding = 0
        
    for i in range(l):
        for j in range(i+1, l):
            if cols[i].typ == b"circle" and cols[j].typ == b"circle":
                d = distance(cols[i].x, cols[i].y, cols[j].x, cols[j].y)
                penetration = cols[i].r*cols[i].size_x + cols[j].r*cols[j].size_x - d
                if penetration >= 0:
                    handle_collision(col_resps, i, j, penetration)
            if cols[i].typ == b"circle" and cols[j].typ == b"line":
                penetration = circle_line_col(cols[i], cols[j])
                if penetration > 0:
                    handle_collision(col_resps, i, j, penetration)
            if cols[i].typ == b"line" and cols[j].typ == b"circle":
                penetration = circle_line_col(cols[j], cols[i])
                if penetration > 0:
                    handle_collision(col_resps, i, j, penetration)
                
    return [
        (
            cr.is_colliding,
            [v for v in cr.colliding_with],
            [p for p in cr.penetrations]
        ) for cr in col_resps[:l]
    ]
                    
